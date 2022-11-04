import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Inject, NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import * as i2 from '@ngrx/effects';
import { createEffect, EffectsModule } from '@ngrx/effects';
import * as i1 from '@ngrx/store';
import { State, META_REDUCERS, Store } from '@ngrx/store';
import { __awaiter } from 'tslib';
import * as deepmerge_ from 'deepmerge';
import { startWith, tap, filter, mergeMap, pairwise } from 'rxjs/operators';

const _INITIAL_SYNC_CONFIG = new InjectionToken('ngrx-store-sync Internal Initial Config');
const _SYNC_CONFIG = new InjectionToken('ngrx-store-sync Internal Config');

const deepmerge = deepmerge_;
const detectDate = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
const StorageSyncActions = {
    DUMMY: 'ngrx-store-sync/dummy',
    HYDRATED: 'ngrx-store-sync/hydrated'
};
const ignoreActions = [State.INIT, StorageSyncActions.HYDRATED];
class StorageSyncEffects {
    constructor(_config, _store, _actions$) {
        this._config = _config;
        this._store = _store;
        this._actions$ = _actions$;
        this._hydrated = false;
        this.sync$ = createEffect(() => this._actions$.pipe(startWith({ type: StorageSyncActions.DUMMY }), tap(action => this._hydrated = this._hydrated || (action.type === StorageSyncActions.HYDRATED)), // Side-effecty :(
        filter(action => ignoreActions.indexOf(action.type) === -1), mergeMap(() => this._store.select(s => s)), pairwise(), filter(() => !this._config.rehydrate || this._hydrated), filter(([prev, curr]) => prev !== curr), mergeMap(([_, curr]) => syncStateUpdateAsync(curr, this._config.keys, this._config.storage, this._config.storageKeySerializer, this._config.removeOnUndefined, this._config.syncCondition))), { dispatch: false });
    }
}
StorageSyncEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: StorageSyncEffects, deps: [{ token: _SYNC_CONFIG }, { token: i1.Store }, { token: i2.Actions }], target: i0.ɵɵFactoryTarget.Injectable });
StorageSyncEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: StorageSyncEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: StorageSyncEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Inject,
                        args: [_SYNC_CONFIG]
                    }] }, { type: i1.Store }, { type: i2.Actions }];
    } });
/**
 * Below this point is essentially a copy-paste of
 * https://github.com/btroncone/ngrx-store-localstorage
 * modified to interact with an asynchronous storage API
 */
// correctly parse dates from storage
const dateReviver = (key, value) => {
    if (typeof value === 'string' && detectDate.test(value)) {
        return new Date(value);
    }
    return value;
};
const dummyReviver = (key, value) => value;
const rehydrateApplicationStateAsync = (keys, storage, storageKeySerializer, restoreDates) => {
    return keys.reduce((previousPromise, curr) => __awaiter(void 0, void 0, void 0, function* () {
        const state = yield previousPromise;
        let key = curr;
        let reviver = restoreDates ? dateReviver : dummyReviver;
        let deserialize;
        let decrypt;
        if (typeof key === 'object') {
            key = Object.keys(key)[0];
            // use the custom reviver function
            if (typeof curr[key] === 'function') {
                reviver = curr[key];
            }
            else {
                // use custom reviver function if available
                if (curr[key].reviver) {
                    reviver = curr[key].reviver;
                }
                // use custom serialize function if available
                if (curr[key].deserialize) {
                    deserialize = curr[key].deserialize;
                }
            }
            // Ensure that encrypt and decrypt functions are both presents
            if (curr[key].encrypt && curr[key].decrypt) {
                if (typeof curr[key].encrypt === 'function' &&
                    typeof curr[key].decrypt === 'function') {
                    decrypt = curr[key].decrypt;
                }
                else {
                    console.error(`Either encrypt or decrypt is not a function on '${curr[key]}' key object.`);
                }
            }
            else if (curr[key].encrypt || curr[key].decrypt) {
                // Let know that one of the encryption functions is not provided
                console.error(`Either encrypt or decrypt function is not present on '${curr[key]}' key object.`);
            }
        }
        return storage.get(storageKeySerializer(key)).then(slice => {
            if (slice) {
                // Use provided decrypt function
                if (decrypt) {
                    slice = decrypt(slice);
                    const isObjectRegex = new RegExp('[{\\[]');
                    if (slice === 'null' || isObjectRegex.test(slice.charAt(0))) {
                        slice = JSON.parse(slice, reviver);
                    }
                }
                return Object.assign({}, state, {
                    [key]: deserialize ? deserialize(slice) : slice
                });
            }
            return state;
        });
    }), storage.ready().then(() => ({})));
};
const syncStateUpdateAsync = (state, keys, storage, storageKeySerializer = key => key, removeOnUndefined = false, syncCondition) => {
    try {
        if (syncCondition && syncCondition(state) !== true) {
            return Promise.resolve();
        }
    }
    catch (e) {
        // Treat TypeError as do not sync
        if (e instanceof TypeError) {
            return Promise.resolve();
        }
        throw e;
    }
    return keys.reduce((previousPromise, key) => __awaiter(void 0, void 0, void 0, function* () {
        yield previousPromise;
        let stateSlice = state[key];
        let replacer;
        let space;
        let encrypt;
        if (typeof key === 'object') {
            const name = Object.keys(key)[0];
            stateSlice = state[name];
            if (typeof stateSlice !== 'undefined' && key[name]) {
                // use serialize function if specified.
                if (key[name].serialize) {
                    stateSlice = key[name].serialize(stateSlice);
                }
                else {
                    // if serialize function is not specified keyFilter on fields if an array has been provided.
                    let keyFilter;
                    if (key[name].reduce) {
                        keyFilter = key[name];
                    }
                    else if (key[name].filter) {
                        keyFilter = key[name].filter;
                    }
                    if (keyFilter) {
                        stateSlice = keyFilter.reduce((memo, attr) => {
                            memo[attr] = stateSlice[attr];
                            return memo;
                        }, {});
                    }
                    // Check if encrypt and decrypt are present, also checked at this#rehydrateApplicationState()
                    if (key[name].encrypt && key[name].decrypt) {
                        if (typeof key[name].encrypt === 'function') {
                            encrypt = key[name].encrypt;
                        }
                    }
                    else if (key[name].encrypt || key[name].decrypt) {
                        // If one of those is not present, then let know that one is missing
                        console.error(`Either encrypt or decrypt function is not present on '${key[name]}' key object.`);
                    }
                }
                /*
                  Replacer and space arguments to pass to JSON.stringify.
                  If these fields don't exist, undefined will be passed.
                 */
                replacer = key[name].replacer;
                space = key[name].space;
            }
            key = name;
        }
        if (typeof stateSlice !== 'undefined') {
            if (encrypt) {
                try {
                    // ensure that a string message is passed
                    stateSlice = encrypt(typeof stateSlice === 'string'
                        ? stateSlice
                        : JSON.stringify(stateSlice, replacer, space));
                }
                catch (e) {
                    console.warn('Unable to encrypt state:', e);
                }
            }
            return storage.set(storageKeySerializer(key), stateSlice)
                .catch(() => { throw new Error('Unable to save state to storage'); });
        }
        else if (typeof stateSlice === 'undefined' && removeOnUndefined) {
            return storage.remove(storageKeySerializer(key))
                .catch(() => { throw new Error(`Exception on removing/cleaning undefined '${key}' state`); });
        }
        return Promise.resolve();
    }), storage.ready().then(() => undefined));
};
const storageSync = () => (reducer) => {
    return (state, action) => {
        let nextState;
        // If state arrives undefined, we need to let it through the supplied reducer
        // in order to get a complete state as defined by user
        if ((action.type === State.INIT) && !state) {
            nextState = reducer(state, action);
        }
        else {
            nextState = state;
        }
        if (action.type === StorageSyncActions.HYDRATED && action.payload) {
            const overwriteMerge = (destinationArray, sourceArray, _) => sourceArray;
            const options = {
                arrayMerge: overwriteMerge
            };
            nextState = deepmerge(nextState, action.payload, options);
        }
        return reducer(nextState, action);
    };
};

function _storeInitializerFactory(store, config) {
    if (!config.rehydrate) {
        return () => Promise.resolve(true);
    }
    return () => rehydrateApplicationStateAsync(config.keys, config.storage, config.storageKeySerializer, // Config always updated to ensure property is defined (i.e. use identity mapping if none specified)
    config.restoreDates // Config always updated to ensure property is defined
    ).then(state => {
        store.dispatch({
            type: StorageSyncActions.HYDRATED,
            payload: state
        });
        return true;
    });
}
function _storageSyncReducerFactory() {
    const sync = storageSync();
    return (reduce) => sync(reduce);
}
function _validateStateKeys(keys) {
    return keys.map(key => {
        let attr = key;
        if (typeof key === 'object') {
            attr = Object.keys(key)[0];
        }
        if (typeof attr !== 'string') {
            throw new TypeError(`StorageSync Unknown Parameter Type: ` +
                `Expected type of string, got ${typeof attr}`);
        }
        return key;
    });
}
function _createConfig(injector, config) {
    const result = config instanceof InjectionToken ? injector.get(config) : config;
    if (result.storageKeySerializer === undefined) {
        result.storageKeySerializer = key => key;
    }
    if (result.restoreDates === undefined) {
        result.restoreDates = true;
    }
    _validateStateKeys(result.keys);
    return result;
}
class StoreSyncRootModule {
}
StoreSyncRootModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: StoreSyncRootModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
StoreSyncRootModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.8", ngImport: i0, type: StoreSyncRootModule, imports: [i2.EffectsFeatureModule] });
StoreSyncRootModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: StoreSyncRootModule, imports: [EffectsModule.forFeature([StorageSyncEffects])] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: StoreSyncRootModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        EffectsModule.forFeature([StorageSyncEffects])
                    ]
                }]
        }] });
class StoreSyncModule {
    static forRoot(config) {
        return {
            ngModule: StoreSyncRootModule,
            providers: [
                { provide: _INITIAL_SYNC_CONFIG, useValue: config },
                { provide: _SYNC_CONFIG, deps: [Injector, _INITIAL_SYNC_CONFIG], useFactory: _createConfig },
                { provide: META_REDUCERS, useFactory: _storageSyncReducerFactory, multi: true },
                { provide: APP_INITIALIZER, deps: [Store, _SYNC_CONFIG], useFactory: _storeInitializerFactory, multi: true }
            ]
        };
    }
}
StoreSyncModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: StoreSyncModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
StoreSyncModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.8", ngImport: i0, type: StoreSyncModule });
StoreSyncModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: StoreSyncModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: StoreSyncModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });

/**
 * Adapter for synchronous Web Storage-based syncing. (i.e. localStorage, sessionStorage)
 */
class WebStorageStoreStorage {
    constructor(_storage) {
        this._storage = _storage;
    }
    get(key) {
        return Promise.resolve(this._storage.getItem(key));
    }
    remove(key) {
        return Promise.resolve(this._storage.removeItem(key));
    }
    set(key, value) {
        const originalValue = value;
        return new Promise(resolve => {
            this._storage.setItem(key, value);
            resolve(originalValue);
        });
    }
    ready() {
        return Promise.resolve();
    }
}

/*
 * Public API Surface of ngrx-store-sync
 */

/**
 * Generated bundle index. Do not edit.
 */

export { StoreSyncModule, WebStorageStoreStorage };
//# sourceMappingURL=ngrx-store-sync.mjs.map
