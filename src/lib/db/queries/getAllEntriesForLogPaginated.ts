import type { FormId, FormRaw, LogId, LogRaw } from "..";
import db from "..";
import type { ExtendedEntry } from "../types/ExtendedEntry";

export default async function getAllEntriesForLogPaginated(log: LogRaw, pageIndex: number, PAGE_SIZE: number): Promise<ExtendedEntry[]> {
    const forms = await db.forms
        .where('logId')
        .equals(log.id)
        .toArray();

    const formIds = new Set(forms.map(f => f.id));

    const entries = await db.entries
        .orderBy('displayDatetime')
        .reverse()
        .filter(e => formIds.has(e.formId))
        .offset(PAGE_SIZE * pageIndex)
        .limit(PAGE_SIZE)
        .toArray();

    const formsById = forms.reduce((acc, cur) => {
        acc.set(cur.id, cur);
        return acc;
    }, new Map<FormId, FormRaw>());

    return entries
        .map((e) => {
            const form = formsById.get(e.formId);
            return {
                ...e,
                form,
                log
            };
        })
        .filter((e) => e.form) as ExtendedEntry[];
}