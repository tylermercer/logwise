import { liveQuery } from "dexie";
import type { Readable } from "svelte/store";

export default function liveQueryAsStore<T>(func: () => T | Promise<T>) {
    return liveQuery(func) as unknown as Readable<T>;
}