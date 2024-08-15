import db from "..";
import { DB_TRUE, type DbBool, type FormId, type FormRaw } from "../types";
import type { ExtendedLog } from "../types/ExtendedLog";

export default async function getAllEntriesByIsArchived(isArchived: DbBool): Promise<ExtendedLog[]> {
    const fetchedLogs = await db.logs.where('isArchived').equals(isArchived).toArray();
    const fetchedForms = await db.forms
        .where('id')
        .anyOf(fetchedLogs.map((l) => l.currentFormId))
        .toArray();

    const formsById = fetchedForms.reduce((acc, cur) => {
        acc.set(cur.id, cur);
        return acc;
    }, new Map<FormId, FormRaw>());

    return fetchedLogs
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((l) => ({
            ...l,
            currentForm: formsById.get(l.currentFormId)!
        }));
}