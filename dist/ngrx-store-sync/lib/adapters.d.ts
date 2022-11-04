import { StoreStorage } from './sync.module';
/**
 * Adapter for synchronous Web Storage-based syncing. (i.e. localStorage, sessionStorage)
 */
export declare class WebStorageStoreStorage implements StoreStorage {
    private _storage;
    constructor(_storage: Storage);
    get(key: string): Promise<any>;
    remove(key: string): Promise<void>;
    set(key: string, value: any): Promise<any>;
    ready(): Promise<void>;
}
