import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StoreStorage, StoreSyncConfig } from './sync.module';
import * as i0 from "@angular/core";
export declare const StorageSyncActions: {
    DUMMY: string;
    HYDRATED: string;
};
export declare class StorageSyncEffects {
    private _config;
    private _store;
    private _actions$;
    constructor(_config: StoreSyncConfig, _store: Store<any>, _actions$: Actions);
    private _hydrated;
    sync$: Observable<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<StorageSyncEffects, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StorageSyncEffects>;
}
/**
 * Below this point is essentially a copy-paste of
 * https://github.com/btroncone/ngrx-store-localstorage
 * modified to interact with an asynchronous storage API
 */
export declare const dateReviver: (key: string, value: any) => any;
export declare const rehydrateApplicationStateAsync: (keys: any[], storage: StoreStorage, storageKeySerializer: (key: string) => string, restoreDates: boolean) => Promise<any>;
export declare const syncStateUpdateAsync: (state: any, keys: any[], storage: StoreStorage, storageKeySerializer?: (key: string) => string, removeOnUndefined?: boolean, syncCondition?: ((state: any) => boolean) | undefined) => Promise<void>;
export declare const storageSync: () => (reducer: any) => (state: any, action: any) => any;
