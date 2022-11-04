import { APP_INITIALIZER, InjectionToken, Injector, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { META_REDUCERS, Store } from '@ngrx/store';
import { rehydrateApplicationStateAsync, storageSync, StorageSyncActions, StorageSyncEffects } from './sync';
import { _INITIAL_SYNC_CONFIG, _SYNC_CONFIG } from './tokens';
import * as i0 from "@angular/core";
import * as i1 from "@ngrx/effects";
export function _storeInitializerFactory(store, config) {
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
export function _storageSyncReducerFactory() {
    const sync = storageSync();
    return (reduce) => sync(reduce);
}
export function _validateStateKeys(keys) {
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
export function _createConfig(injector, config) {
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
export class StoreSyncRootModule {
}
StoreSyncRootModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: StoreSyncRootModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
StoreSyncRootModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.8", ngImport: i0, type: StoreSyncRootModule, imports: [i1.EffectsFeatureModule] });
StoreSyncRootModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: StoreSyncRootModule, imports: [EffectsModule.forFeature([StorageSyncEffects])] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.8", ngImport: i0, type: StoreSyncRootModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        EffectsModule.forFeature([StorageSyncEffects])
                    ]
                }]
        }] });
export class StoreSyncModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3J4LXN0b3JlLXN5bmMvc3JjL2xpYi9zeW5jLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6RyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE9BQU8sRUFBaUIsYUFBYSxFQUFlLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMvRSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQzdHLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxZQUFZLEVBQUUsTUFBTSxVQUFVLENBQUM7OztBQTBDOUQsTUFBTSxVQUFVLHdCQUF3QixDQUFDLEtBQWlCLEVBQUUsTUFBdUI7SUFDL0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDbkIsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3RDO0lBRUQsT0FBTyxHQUFHLEVBQUUsQ0FBQyw4QkFBOEIsQ0FDdkMsTUFBTSxDQUFDLElBQUksRUFDWCxNQUFNLENBQUMsT0FBTyxFQUNkLE1BQU0sQ0FBQyxvQkFBK0MsRUFBRSxvR0FBb0c7SUFDNUosTUFBTSxDQUFDLFlBQXVCLENBQUMsc0RBQXNEO0tBQ3hGLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ1gsS0FBSyxDQUFDLFFBQVEsQ0FBQztZQUNYLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxRQUFRO1lBQ2pDLE9BQU8sRUFBRSxLQUFLO1NBQ2pCLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVELE1BQU0sVUFBVSwwQkFBMEI7SUFDdEMsTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFLENBQUM7SUFDM0IsT0FBTyxDQUFDLE1BQTBCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBRUQsTUFBTSxVQUFVLGtCQUFrQixDQUFDLElBQVc7SUFDMUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ2xCLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUVmLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQ3pCLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlCO1FBRUQsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDMUIsTUFBTSxJQUFJLFNBQVMsQ0FDZixzQ0FBc0M7Z0JBQ3RDLGdDQUFnQyxPQUFPLElBQUksRUFBRSxDQUNoRCxDQUFDO1NBQ0w7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVELE1BQU0sVUFBVSxhQUFhLENBQ3pCLFFBQWtCLEVBQ2xCLE1BQXlEO0lBRXpELE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxjQUFjLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNoRixJQUFJLE1BQU0sQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLEVBQUU7UUFDM0MsTUFBTSxDQUFDLG9CQUFvQixHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDO0tBQzVDO0lBRUQsSUFBSSxNQUFNLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRTtRQUNuQyxNQUFNLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztLQUM5QjtJQUVELGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBT0QsTUFBTSxPQUFPLG1CQUFtQjs7Z0hBQW5CLG1CQUFtQjtpSEFBbkIsbUJBQW1CO2lIQUFuQixtQkFBbUIsWUFIeEIsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUM7MkZBR3pDLG1CQUFtQjtrQkFML0IsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUU7d0JBQ0wsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUM7cUJBQ2pEO2lCQUNKOztBQUlELE1BQU0sT0FBTyxlQUFlO0lBQ2pCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBeUQ7UUFDM0UsT0FBTztZQUNILFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsU0FBUyxFQUFFO2dCQUNQLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7Z0JBQ25ELEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsb0JBQW9CLENBQUMsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFO2dCQUM1RixFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLDBCQUEwQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7Z0JBQy9FLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLEVBQUUsVUFBVSxFQUFFLHdCQUF3QixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7YUFDL0c7U0FDSixDQUFDO0lBQ04sQ0FBQzs7NEdBWFEsZUFBZTs2R0FBZixlQUFlOzZHQUFmLGVBQWU7MkZBQWYsZUFBZTtrQkFEM0IsUUFBUTttQkFBQyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQVBQX0lOSVRJQUxJWkVSLCBJbmplY3Rpb25Ub2tlbiwgSW5qZWN0b3IsIE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEVmZmVjdHNNb2R1bGUgfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcclxuaW1wb3J0IHsgQWN0aW9uUmVkdWNlciwgTUVUQV9SRURVQ0VSUywgTWV0YVJlZHVjZXIsIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQgeyByZWh5ZHJhdGVBcHBsaWNhdGlvblN0YXRlQXN5bmMsIHN0b3JhZ2VTeW5jLCBTdG9yYWdlU3luY0FjdGlvbnMsIFN0b3JhZ2VTeW5jRWZmZWN0cyB9IGZyb20gJy4vc3luYyc7XHJcbmltcG9ydCB7IF9JTklUSUFMX1NZTkNfQ09ORklHLCBfU1lOQ19DT05GSUcgfSBmcm9tICcuL3Rva2Vucyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JlU3RvcmFnZSB7XHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiBrZXkuXHJcbiAgICAgKiBAcGFyYW0ga2V5IHRoZSBrZXkgdG8gaWRlbnRpZnkgdGhpcyB2YWx1ZVxyXG4gICAgICogQHJldHVybnMgUmV0dXJucyBhIHByb21pc2Ugd2l0aCB0aGUgdmFsdWUgb2YgdGhlIGdpdmVuIGtleVxyXG4gICAgICovXHJcbiAgICBnZXQoa2V5OiBzdHJpbmcpOiBQcm9taXNlPGFueT47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdGhlIHZhbHVlIGZvciB0aGUgZ2l2ZW4ga2V5LlxyXG4gICAgICogQHBhcmFtIGtleSB0aGUga2V5IHRvIGlkZW50aWZ5IHRoaXMgdmFsdWVcclxuICAgICAqIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgZm9yIHRoaXMga2V5XHJcbiAgICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGtleSBhbmQgdmFsdWUgYXJlIHNldFxyXG4gICAgICovXHJcbiAgICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBQcm9taXNlPGFueT47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYW55IHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGtleS5cclxuICAgICAqIEBwYXJhbSBrZXkgdGhlIGtleSB0byBpZGVudGlmeSB0aGlzIHZhbHVlXHJcbiAgICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIHZhbHVlIGlzIHJlbW92ZWRcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlKGtleTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHRoZSBzdG9yYWdlIGlzIHJlYWR5IHRvIGJlIHVzZWRcclxuICAgICAqIEByZXR1cm5zIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0aGUgc3RvcmFnZSBpcyByZWFkeSB0byBiZSB1c2VkXHJcbiAgICAgKi9cclxuICAgIHJlYWR5KCk6IFByb21pc2U8YW55PjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTdG9yZVN5bmNDb25maWcge1xyXG4gICAga2V5czogYW55W107XHJcbiAgICByZWh5ZHJhdGU/OiBib29sZWFuO1xyXG4gICAgc3RvcmFnZTogU3RvcmVTdG9yYWdlO1xyXG4gICAgcmVtb3ZlT25VbmRlZmluZWQ/OiBib29sZWFuO1xyXG4gICAgcmVzdG9yZURhdGVzPzogYm9vbGVhbjtcclxuICAgIHN0b3JhZ2VLZXlTZXJpYWxpemVyPzogKGtleTogc3RyaW5nKSA9PiBzdHJpbmc7XHJcbiAgICBzeW5jQ29uZGl0aW9uPzogKHN0YXRlOiBhbnkpID0+IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfc3RvcmVJbml0aWFsaXplckZhY3Rvcnkoc3RvcmU6IFN0b3JlPGFueT4sIGNvbmZpZzogU3RvcmVTeW5jQ29uZmlnKTogKCkgPT4gUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICBpZiAoIWNvbmZpZy5yZWh5ZHJhdGUpIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoKSA9PiByZWh5ZHJhdGVBcHBsaWNhdGlvblN0YXRlQXN5bmMoXHJcbiAgICAgICAgY29uZmlnLmtleXMsXHJcbiAgICAgICAgY29uZmlnLnN0b3JhZ2UsXHJcbiAgICAgICAgY29uZmlnLnN0b3JhZ2VLZXlTZXJpYWxpemVyIGFzIChrZXk6IHN0cmluZykgPT4gc3RyaW5nLCAvLyBDb25maWcgYWx3YXlzIHVwZGF0ZWQgdG8gZW5zdXJlIHByb3BlcnR5IGlzIGRlZmluZWQgKGkuZS4gdXNlIGlkZW50aXR5IG1hcHBpbmcgaWYgbm9uZSBzcGVjaWZpZWQpXHJcbiAgICAgICAgY29uZmlnLnJlc3RvcmVEYXRlcyBhcyBib29sZWFuIC8vIENvbmZpZyBhbHdheXMgdXBkYXRlZCB0byBlbnN1cmUgcHJvcGVydHkgaXMgZGVmaW5lZFxyXG4gICAgKS50aGVuKHN0YXRlID0+IHtcclxuICAgICAgICBzdG9yZS5kaXNwYXRjaCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFN0b3JhZ2VTeW5jQWN0aW9ucy5IWURSQVRFRCxcclxuICAgICAgICAgICAgcGF5bG9hZDogc3RhdGVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX3N0b3JhZ2VTeW5jUmVkdWNlckZhY3RvcnkoKTogTWV0YVJlZHVjZXI8YW55PiB7XHJcbiAgICBjb25zdCBzeW5jID0gc3RvcmFnZVN5bmMoKTtcclxuICAgIHJldHVybiAocmVkdWNlOiBBY3Rpb25SZWR1Y2VyPGFueT4pID0+IHN5bmMocmVkdWNlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF92YWxpZGF0ZVN0YXRlS2V5cyhrZXlzOiBhbnlbXSk6IGFueVtdIHtcclxuICAgIHJldHVybiBrZXlzLm1hcChrZXkgPT4ge1xyXG4gICAgICAgIGxldCBhdHRyID0ga2V5O1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgYXR0ciA9IE9iamVjdC5rZXlzKGtleSlbMF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGF0dHIgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgU3RvcmFnZVN5bmMgVW5rbm93biBQYXJhbWV0ZXIgVHlwZTogYCArXHJcbiAgICAgICAgICAgICAgICBgRXhwZWN0ZWQgdHlwZSBvZiBzdHJpbmcsIGdvdCAke3R5cGVvZiBhdHRyfWBcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGtleTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX2NyZWF0ZUNvbmZpZyhcclxuICAgIGluamVjdG9yOiBJbmplY3RvcixcclxuICAgIGNvbmZpZzogU3RvcmVTeW5jQ29uZmlnIHwgSW5qZWN0aW9uVG9rZW48U3RvcmVTeW5jQ29uZmlnPlxyXG4pOiBTdG9yZVN5bmNDb25maWcge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gY29uZmlnIGluc3RhbmNlb2YgSW5qZWN0aW9uVG9rZW4gPyBpbmplY3Rvci5nZXQoY29uZmlnKSA6IGNvbmZpZztcclxuICAgIGlmIChyZXN1bHQuc3RvcmFnZUtleVNlcmlhbGl6ZXIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJlc3VsdC5zdG9yYWdlS2V5U2VyaWFsaXplciA9IGtleSA9PiBrZXk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlc3VsdC5yZXN0b3JlRGF0ZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJlc3VsdC5yZXN0b3JlRGF0ZXMgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIF92YWxpZGF0ZVN0YXRlS2V5cyhyZXN1bHQua2V5cyk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogW1xyXG4gICAgICAgIEVmZmVjdHNNb2R1bGUuZm9yRmVhdHVyZShbU3RvcmFnZVN5bmNFZmZlY3RzXSlcclxuICAgIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFN0b3JlU3luY1Jvb3RNb2R1bGUge31cclxuXHJcbkBOZ01vZHVsZSh7fSlcclxuZXhwb3J0IGNsYXNzIFN0b3JlU3luY01vZHVsZSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGZvclJvb3QoY29uZmlnOiBTdG9yZVN5bmNDb25maWcgfCBJbmplY3Rpb25Ub2tlbjxTdG9yZVN5bmNDb25maWc+KTogTW9kdWxlV2l0aFByb3ZpZGVyczxTdG9yZVN5bmNSb290TW9kdWxlPiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmdNb2R1bGU6IFN0b3JlU3luY1Jvb3RNb2R1bGUsXHJcbiAgICAgICAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgICAgICAgICAgeyBwcm92aWRlOiBfSU5JVElBTF9TWU5DX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZyB9LFxyXG4gICAgICAgICAgICAgICAgeyBwcm92aWRlOiBfU1lOQ19DT05GSUcsIGRlcHM6IFtJbmplY3RvciwgX0lOSVRJQUxfU1lOQ19DT05GSUddLCB1c2VGYWN0b3J5OiBfY3JlYXRlQ29uZmlnIH0sXHJcbiAgICAgICAgICAgICAgICB7IHByb3ZpZGU6IE1FVEFfUkVEVUNFUlMsIHVzZUZhY3Rvcnk6IF9zdG9yYWdlU3luY1JlZHVjZXJGYWN0b3J5LCBtdWx0aTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyBwcm92aWRlOiBBUFBfSU5JVElBTElaRVIsIGRlcHM6IFtTdG9yZSwgX1NZTkNfQ09ORklHXSwgdXNlRmFjdG9yeTogX3N0b3JlSW5pdGlhbGl6ZXJGYWN0b3J5LCBtdWx0aTogdHJ1ZSB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==