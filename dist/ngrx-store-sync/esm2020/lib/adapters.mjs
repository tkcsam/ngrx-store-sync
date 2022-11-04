/**
 * Adapter for synchronous Web Storage-based syncing. (i.e. localStorage, sessionStorage)
 */
export class WebStorageStoreStorage {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRhcHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3J4LXN0b3JlLXN5bmMvc3JjL2xpYi9hZGFwdGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTs7R0FFRztBQUNILE1BQU0sT0FBTyxzQkFBc0I7SUFDL0IsWUFBb0IsUUFBaUI7UUFBakIsYUFBUSxHQUFSLFFBQVEsQ0FBUztJQUFHLENBQUM7SUFFekMsR0FBRyxDQUFDLEdBQVc7UUFDWCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQVc7UUFDZCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsR0FBRyxDQUFDLEdBQVcsRUFBRSxLQUFVO1FBQ3ZCLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQztRQUM1QixPQUFPLElBQUksT0FBTyxDQUFNLE9BQU8sQ0FBQyxFQUFFO1lBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsS0FBSztRQUNELE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0b3JlU3RvcmFnZSB9IGZyb20gJy4vc3luYy5tb2R1bGUnO1xyXG5cclxuLyoqXHJcbiAqIEFkYXB0ZXIgZm9yIHN5bmNocm9ub3VzIFdlYiBTdG9yYWdlLWJhc2VkIHN5bmNpbmcuIChpLmUuIGxvY2FsU3RvcmFnZSwgc2Vzc2lvblN0b3JhZ2UpXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgV2ViU3RvcmFnZVN0b3JlU3RvcmFnZSBpbXBsZW1lbnRzIFN0b3JlU3RvcmFnZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9zdG9yYWdlOiBTdG9yYWdlKSB7fVxyXG5cclxuICAgIGdldChrZXk6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9zdG9yYWdlLmdldEl0ZW0oa2V5KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlKGtleTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9zdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICBjb25zdCBvcmlnaW5hbFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4ocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgcmVzb2x2ZShvcmlnaW5hbFZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZWFkeSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cclxuIl19