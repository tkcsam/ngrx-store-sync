import { InjectionToken, Injector, ModuleWithProviders } from '@angular/core';
import { MetaReducer, Store } from '@ngrx/store';
import * as i0 from "@angular/core";
import * as i1 from "@ngrx/effects";
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
export declare function _storeInitializerFactory(store: Store<any>, config: StoreSyncConfig): () => Promise<boolean>;
export declare function _storageSyncReducerFactory(): MetaReducer<any>;
export declare function _validateStateKeys(keys: any[]): any[];
export declare function _createConfig(injector: Injector, config: StoreSyncConfig | InjectionToken<StoreSyncConfig>): StoreSyncConfig;
export declare class StoreSyncRootModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<StoreSyncRootModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<StoreSyncRootModule, never, [typeof i1.EffectsFeatureModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<StoreSyncRootModule>;
}
export declare class StoreSyncModule {
    static forRoot(config: StoreSyncConfig | InjectionToken<StoreSyncConfig>): ModuleWithProviders<StoreSyncRootModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<StoreSyncModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<StoreSyncModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<StoreSyncModule>;
}
