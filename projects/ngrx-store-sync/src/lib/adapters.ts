import { StoreStorage } from './sync.module';

/**
 * Adapter for synchronous Web Storage-based syncing. (i.e. localStorage, sessionStorage)
 */
export class WebStorageStoreStorage implements StoreStorage {
    constructor(private _storage: Storage) {}

    get(key: string): Promise<any> {
        return Promise.resolve(this._storage.getItem(key));
    }

    remove(key: string): Promise<void> {
        return Promise.resolve(this._storage.removeItem(key));
    }

    set(key: string, value: any): Promise<any> {
        const originalValue = value;
        return new Promise<any>(resolve => {
            this._storage.setItem(key, value);
            resolve(originalValue);
        });
    }

    ready(): Promise<void> {
        return Promise.resolve();
    }
}
