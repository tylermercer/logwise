import type { FormId, FormRaw, LogId, LogRaw } from "../AppDexie";
import db from "..";
import type { ExtendedEntry } from "../types/ExtendedEntry";

export default async function getAllEntriesPaginated(pageIndex: number, PAGE_SIZE: number): Promise<ExtendedEntry[]> {
    const entries = await db.entries
        .orderBy('displayDatetime')
        .reverse()
        .offset(PAGE_SIZE * pageIndex)
        .limit(PAGE_SIZE)
        .toArray();
    const forms = await db.forms
        .where('id')
        .anyOf(entries.map((l) => l.formId))
        .toArray();
    const logs = await db.logs
        .where('id')
        .anyOf(forms.map((f) => f.logId))
        .toArray();

    const formsById = forms.reduce((acc, cur) => {
        acc.set(cur.id, cur);
        return acc;
    }, new Map<FormId, FormRaw>());

    const logsById = logs.reduce((acc, cur) => {
        acc.set(cur.id, cur);
        return acc;
    }, new Map<LogId, LogRaw>());

    return entries
        .map((e) => {
            const form = formsById.get(e.formId);
            const log = form ? logsById.get(form.logId) : undefined;
            return {
                ...e,
                form,
                log
            };
        })
        .filter((e) => e.form && e.log) as ExtendedEntry[];
}