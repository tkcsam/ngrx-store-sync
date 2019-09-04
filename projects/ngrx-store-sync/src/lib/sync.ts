import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { State, Store } from '@ngrx/store';

import * as deepmerge_ from 'deepmerge';
import { Observable } from 'rxjs';
import { filter, flatMap, pairwise, startWith, tap } from 'rxjs/operators';
import { StoreStorage, StoreSyncConfig } from './sync.module';
import { _SYNC_CONFIG } from './tokens';

const deepmerge = deepmerge_;
const detectDate = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;

export const StorageSyncActions = {
    DUMMY: 'ngrx-store-sync/dummy',
    HYDRATED: 'ngrx-store-sync/hydrated'
};

const ignoreActions = [State.INIT, StorageSyncActions.HYDRATED];

@Injectable()
export class StorageSyncEffects {
    constructor(
        @Inject(_SYNC_CONFIG) private _config: StoreSyncConfig,
        private _store: Store<any>,
        private _actions$: Actions
    ) {}

    private _hydrated = false;

    sync$: Observable<any> = createEffect(() => this._actions$.pipe(
        startWith( { type: StorageSyncActions.DUMMY }),
        tap(action => this._hydrated = this._hydrated || (action.type === StorageSyncActions.HYDRATED)), // Side-effecty :(
        filter(action => ignoreActions.indexOf(action.type) === -1),
        flatMap(() => this._store.select(s => s)),
        pairwise(),
        filter(() => !this._config.rehydrate || this._hydrated),
        filter(([prev, curr]) => prev !== curr),
        flatMap(([_, curr]) => syncStateUpdateAsync(
            curr,
            this._config.keys,
            this._config.storage,
            this._config.storageKeySerializer,
            this._config.removeOnUndefined,
            this._config.syncCondition
        ))
    ), { dispatch: false });
}

/**
 * Below this point is essentially a copy-paste of
 * https://github.com/btroncone/ngrx-store-localstorage
 * modified to interact with an asynchronous storage API
 */

// correctly parse dates from storage
export const dateReviver = (key: string, value: any) => {
    if (typeof value === 'string' && detectDate.test(value)) {
        return new Date(value);
    }
    return value;
};

const dummyReviver = (key: string, value: any) => value;

export const rehydrateApplicationStateAsync = (
    keys: any[],
    storage: StoreStorage,
    storageKeySerializer: (key: string) => string,
    restoreDates: boolean
): Promise<any> => {
    return keys.reduce(async (previousPromise, curr) => {
        const state = await previousPromise;

        let key = curr;
        let reviver = restoreDates ? dateReviver : dummyReviver;
        let deserialize;
        let decrypt;

        if (typeof key === 'object') {
            key = Object.keys(key)[0];
            // use the custom reviver function
            if (typeof curr[key] === 'function') {
                reviver = curr[key];
            } else {
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
                if (
                    typeof curr[key].encrypt === 'function' &&
                    typeof curr[key].decrypt === 'function'
                ) {
                    decrypt = curr[key].decrypt;
                } else {
                    console.error(
                        `Either encrypt or decrypt is not a function on '${
                            curr[key]
                        }' key object.`
                    );
                }
            } else if (curr[key].encrypt || curr[key].decrypt) {
                // Let know that one of the encryption functions is not provided
                console.error(
                    `Either encrypt or decrypt function is not present on '${
                        curr[key]
                    }' key object.`
                );
            }
        }

        return storage.get(storageKeySerializer(key)).then(slice => {
            if (slice) {
                // Use provided decrypt function
                if (decrypt) {
                    slice = decrypt(slice);
                    const isObjectRegex = new RegExp('[{\\[]');
                    // let raw = slice;

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
    }, storage.ready().then(() => ({})));
};

export const syncStateUpdateAsync = (
    state: any,
    keys: any[],
    storage: StoreStorage,
    storageKeySerializer: (key: string) => string = key => key,
    removeOnUndefined: boolean = false,
    syncCondition?: (state: any) => boolean
): Promise<void> =>  {
    try {
        if (syncCondition && syncCondition(state) !== true) {
            return;
        }
    } catch ( e ) {
        // Treat TypeError as do not sync
        if (e instanceof TypeError) {
            return;
        }
        throw e;
    }

    return keys.reduce( async (previousPromise, key) => {
        await previousPromise;

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
                } else {
                    // if serialize function is not specified keyFilter on fields if an array has been provided.
                    let keyFilter;
                    if (key[name].reduce) {
                        keyFilter = key[name];
                    } else if (key[name].filter) {
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
                    } else if (key[name].encrypt || key[name].decrypt) {
                        // If one of those is not present, then let know that one is missing
                        console.error(
                            `Either encrypt or decrypt function is not present on '${
                                key[name]
                            }' key object.`
                        );
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
                    stateSlice = encrypt(
                        typeof stateSlice === 'string'
                            ? stateSlice
                            : JSON.stringify(stateSlice, replacer, space)
                    );
                } catch (e) {
                    console.warn('Unable to encrypt state:', e);
                }
            }

            return storage.set(storageKeySerializer(key), stateSlice)
                .catch(() => { throw new Error('Unable to save state to storage'); });
        } else if (typeof stateSlice === 'undefined' && removeOnUndefined) {
            return storage.remove(storageKeySerializer(key))
                .catch(() => { throw new Error(`Exception on removing/cleaning undefined '${key}' state`); });
        }

        return Promise.resolve();
    }, storage.ready().then(() => undefined));
};

export const storageSync = () => (reducer: any) => {
    return (state: any, action: any) => {
        let nextState;

        // If state arrives undefined, we need to let it through the supplied reducer
        // in order to get a complete state as defined by user
        if ((action.type === State.INIT) && !state) {
            nextState = reducer(state, action);
        } else {
            // nextState = { ...state };
            nextState = state;
        }

        if (action.type === StorageSyncActions.HYDRATED && action.payload) {
            const overwriteMerge = (destinationArray, sourceArray, _) => sourceArray;
            const options: deepmerge_.Options = {
                arrayMerge: overwriteMerge
            };
            nextState = deepmerge(nextState, action.payload, options);
        }

        return reducer(nextState, action);
    };
};
