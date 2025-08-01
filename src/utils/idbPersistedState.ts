import { writable, type Writable } from "svelte/store";
import { IndexedDBStore } from "./IndexedDBStore";

const Store = new IndexedDBStore("PersistedState", "state", 1)

export function persistedState<T>(key: string): Writable<T | undefined> {
    const state = writable<T>();

    let lastWrite = Promise.resolve();
    state.subscribe(value => {
        if (value === undefined) return;
        lastWrite = lastWrite.then(() => Store.set(key, value));
    });

    Store.get(key).then(value => {
        if (value !== undefined) {
            state.set(value as T);
        }
    });

    return state;
}
