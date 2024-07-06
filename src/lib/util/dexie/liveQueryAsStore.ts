import { liveQuery } from "dexie";
import { readable } from "svelte/store";

export default function liveQueryAsStore<T>(func: () => T | Promise<T>, initialValue: T) {
    return readable<T>(
        initialValue,
        (set) => liveQuery(func).subscribe(
            q => {
                if (q != null) set(q);
            }
        ).unsubscribe);
}