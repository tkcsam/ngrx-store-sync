import { APP_INITIALIZER, InjectionToken, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, META_REDUCERS, MetaReducer, Store } from '@ngrx/store';
import { rehydrateApplicationStateAsync, storageSync, StorageSyncActions, StorageSyncEffects } from './sync';
import { _INITIAL_SYNC_CONFIG, _SYNC_CONFIG } from './tokens';

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
    storage: StoreStorage;
    removeOnUndefined?: boolean;
    restoreDates?: boolean;
    storageKeySerializer?: (key: string) => string;
    syncCondition?: (state: any) => boolean;
}

export function _storeInitializerFactory(store: Store<any>, config: StoreSyncConfig): () => Promise<boolean> {
    if (!config.rehydrate) {
        return () => Promise.resolve(true);
    }

    return () => rehydrateApplicationStateAsync(
        config.keys,
        config.storage,
        config.storageKeySerializer as (key: string) => string, // Config always updated to ensure property is defined (i.e. use identity mapping if none specified)
        config.restoreDates as boolean // Config always updated to ensure property is defined
    ).then(state => {
        store.dispatch({
            type: StorageSyncActions.HYDRATED,
            payload: state
        });
        return true;
    });
}

export function _storageSyncReducerFactory(): MetaReducer<any> {
    const sync = storageSync();
    return (reduce: ActionReducer<any>) => sync(reduce);
}

export function _validateStateKeys(keys: any[]): any[] {
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

    _validateStateKeys(result.keys);
    return result;
}

@NgModule({
    imports: [
        EffectsModule.forFeature([StorageSyncEffects])
    ]
})
export class StoreSyncRootModule {}

@NgModule({})
export class StoreSyncModule {
    public static forRoot(config: StoreSyncConfig | InjectionToken<StoreSyncConfig>): ModuleWithProviders<StoreSyncRootModule> {
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
