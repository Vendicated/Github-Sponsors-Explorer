function promisifyRequest<T>(request: IDBRequest<T>) {
    return new Promise<T>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function promisifyTransaction(transaction: IDBTransaction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

export class IndexedDBStore<T extends Record<string, unknown>> {
    private db: Promise<IDBDatabase>;

    constructor(readonly dbName: string, readonly storeName: string, readonly version: number) {
        const req = indexedDB.open(dbName, version);
        req.onupgradeneeded = () => req.result.createObjectStore(storeName);

        this.db = promisifyRequest(req);
    }

    async transaction(mode: IDBTransactionMode, callback: (tx: IDBObjectStore) => IDBRequest | IDBTransaction) {
        const db = await this.db;
        const store = db.transaction(this.storeName, mode).objectStore(this.storeName);

        const res = callback(store);
        if (res instanceof IDBRequest) {
            return promisifyRequest(res);
        }
        if (res instanceof IDBTransaction) {
            return promisifyTransaction(res);
        }
        throw new Error("Callback must return an IDBRequest or IDBTransaction");
    }

    get<K extends keyof T>(key: K): Promise<T[K] | undefined> {
        return this.transaction("readonly", s => s.get(key as string))
    }

    set<K extends keyof T>(key: K, value: any): Promise<void> {
        return this.transaction("readwrite", s => {
            s.put(value, key as string);
            return s.transaction;
        })
    }

    del<K extends keyof T>(key: K): Promise<void> {
        return this.transaction("readwrite", s => {
            s.delete(key as string);
            return s.transaction;
        });
    }
}
