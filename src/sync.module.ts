import { APP_INITIALIZER, InjectionToken, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, META_REDUCERS, MetaReducer, Store } from '@ngrx/store';
import { rehydrateApplicationStateAsync, storageSync, StorageSyncActions, StorageSyncEffects } from './sync';
import { _CONFIG_VALIDATOR, _INITIAL_CONFIG, _STORAGE_CONFIG } from './tokens';

export interface StoreStorage {
    /**
     * Get the value associated with the given key.
     * @param key the key to identify this value
     * @returns Returns a promise with the value of the given key
     */
    get(key: string): Promise<any>;

    /**
     * Set the value for the given key.
     * @param key the key to identify this value
     * @param value the value for this key
     * @returns Returns a promise that resolves when the key and value are set
     */
    set(key: string, value: any): Promise<any>;

    /**
     * Remove any value associated with this key.
     * @param key the key to identify this value
     * @returns Returns a promise that resolves when the value is removed
     */
    remove(key: string): Promise<void>;

    /**
     * Check if the storage is ready to be used
     * @returns Returns a promise that resolves when the storage is ready to be used
     */
    ready(): Promise<any>;
}

export interface StoreSyncConfig {
    keys: any[];
    rehydrate?: boolean;
    storage?: StoreStorage;
    removeOnUndefined?: boolean;
    restoreDates?: boolean;
    storageKeySerializer?: (key: string) => string;
    syncCondition?: (state: any) => boolean;
}

export function migrateLocalStorage(
    keys: any[],
    storageKeySerializer: (key: string) => string,
    storage: StoreStorage
): Promise<void> {
    return keys.reduce( async (previousPromise, key) => {
        await previousPromise;

        const storageKey = storageKeySerializer(key);
        return storage.set(storageKey, JSON.parse(localStorage[storageKey]))
            .catch(() => { throw new Error('Unable to save state to localStorage'); });
    }, storage.ready().then(() => ({})));
}

export function _storeInitializerFactory(store: Store<any>, config: StoreSyncConfig): () => Promise<boolean> {
    if (!config.rehydrate) {
        return () => Promise.resolve(true);
    }

    return () => migrateLocalStorage(
        config.keys,
        config.storageKeySerializer,
        config.storage
    ).then(() => rehydrateApplicationStateAsync(
        config.keys,
        config.storage,
        config.storageKeySerializer,
        config.restoreDates
    )).then(state => {
        store.dispatch({
            type: StorageSyncActions.HYDRATED,
            payload: state
        });
        return true;
    });
}

export function _storageSyncReducerFactory(): MetaReducer<any> {
    const sync = storageSync();
    return function(reduce: ActionReducer<any>): ActionReducer<any> {
        return sync(reduce);
    };
}

export function _createConfig(
    injector: Injector,
    config: StoreSyncConfig | InjectionToken<StoreSyncConfig>
): StoreSyncConfig {
    const result = config instanceof InjectionToken ? injector.get(config) : config;
    if (result.storageKeySerializer === undefined) {
        result.storageKeySerializer = key => key;
    }

    if (result.restoreDates === undefined) {
        result.restoreDates = true;
    }
    return result;
}

@NgModule({
    imports: [
        EffectsModule.forFeature([StorageSyncEffects])
    ]
})
export class StoreStorageRootModule {}

@NgModule({})
export class StoreStorageModule {
    public static forRoot(config: StoreSyncConfig | InjectionToken<StoreSyncConfig>): ModuleWithProviders {
        return {
            ngModule: StoreStorageRootModule,
            providers: [
                { provide: _INITIAL_CONFIG, useValue: config },
                { provide: _STORAGE_CONFIG, deps: [Injector, _INITIAL_CONFIG], useFactory: _createConfig },
                { provide: _CONFIG_VALIDATOR, deps: [_STORAGE_CONFIG], useFactory: c => StoreStorageModule._validateStateKeys(c.keys) },
                { provide: META_REDUCERS, useFactory: _storageSyncReducerFactory, multi: true },
                { provide: APP_INITIALIZER, deps: [Store, _STORAGE_CONFIG], useFactory: _storeInitializerFactory, multi: true }
            ]
        };
    }

    public static _validateStateKeys(keys: any[]): any[] {
        return keys.map(key => {
            let attr = key;

            if (typeof key === 'object') {
                attr = Object.keys(key)[0];
            }

            if (typeof attr !== 'string') {
                throw new TypeError(
                    `StorageSync Unknown Parameter Type: ` +
                    `Expected type of string, got ${typeof attr}`
                );
            }
            return key;
        });
    }
}