import AppDexie, { DB_FALSE, DB_NULL, type FormId, type FormRaw, type LogId } from "$lib/db/AppDexie";
import { typeid } from "typeid-unboxed";
import type { Migration } from "../types";
import type { PartialPick } from "$lib/util/types/PartialPick";
import { newestCreatedFirst, oldestCreatedFirst } from "$lib/util/createdDatetimeComparators";


type OldFormRaw = PartialPick<FormRaw, 'logId'> & { name?: string }

const MIGRATION_NUMBER = 1;

/**
 * Convert named forms to logs and remove names
 */
export default {
    async migrate(db: AppDexie) {
        try {
            const [logs, forms, entries] = await db.transaction('rw', db.tables, async (trans) => {
                //We have to filter here because we can't query for schemaVer === undefined
                const formsToMigrate: OldFormRaw[] =
                    (await db.forms.filter(f => (f.schemaVer ?? 0) === 0).toArray()) as unknown[] as OldFormRaw[];

                const formsById: Map<FormId, OldFormRaw> = formsToMigrate
                    .reduce((acc, cur) => acc.set(cur.id, cur), new Map<FormId, OldFormRaw>());

                const latestVersionMap = new Map<FormId, FormId>();

                const findLatestVersionIdAndRecency = async (form: OldFormRaw): Promise<FormId> => {
                    if (latestVersionMap.has(form.id)) {
                        return latestVersionMap.get(form.id)!;
                    }
                    if (form.nextVersionId === DB_NULL) {
                        if (form.prevVersionId !== DB_NULL && !latestVersionMap.has(form.prevVersionId)) {
                            latestVersionMap.set(form.prevVersionId, form.id);
                        }
                        return form.id;
                    }
                    if (latestVersionMap.has(form.nextVersionId)) {
                        const nextLatestVersionId = latestVersionMap.get(form.nextVersionId)!;
                        return nextLatestVersionId;
                    }
                    if (!formsById.has(form.nextVersionId)) {
                        const nextForm = (await db.forms.get(form.nextVersionId) as OldFormRaw | undefined);
                        if (!nextForm) {
                            //ERROR! Do something useful here. Maybe just use this form as its own latest?
                            throw 'oh no';
                        }
                        formsById.set(nextForm.id, nextForm);
                    }
                    const latestIdAndRecency = await findLatestVersionIdAndRecency(formsById.get(form.nextVersionId)!);
                    latestVersionMap.set(form.id, latestIdAndRecency);
                    return latestIdAndRecency;
                }

                //Group forms by their latest version
                const groups = await formsToMigrate.reduce(
                    async (groupedPromise: Promise<Map<FormId,OldFormRaw[]>>, form: OldFormRaw) => {
                        const latestVersionId = await findLatestVersionIdAndRecency(form);
                        const grouped = await groupedPromise;
                        if (!grouped.has(latestVersionId)) {
                            grouped.set(latestVersionId, []);
                        }
                        grouped.get(latestVersionId)!.push(form);
                        return grouped;
                    },
                    Promise.resolve(new Map<FormId, OldFormRaw[]>()) as Promise<Map<FormId, OldFormRaw[]>>
                );

                //For each form group, create a new log entity with the name of the latest version.
                await Promise.all(
                    Array.from(groups.entries()).map(async ([latestVersionId, forms]) => {
                        forms.sort(newestCreatedFirst);

                        //The form id of a preceding, already-migrated version (if one exists)
                        const existingLogId = await getExistingLogIdIfExists(forms, db);

                        const logId = existingLogId ?? typeid('log');

                        const latest = formsById.get(latestVersionId)!;
                        const now = new Date();

                        return await Promise.all([
                            db.logs.put({
                                id: logId,
                                name: latest.name ?? 'Unnamed log',
                                description: '',
                                color: 'gray',
                                currentFormId: latest.id,
                                createdDatetime: now,
                                modifiedDatetime: now,
                                isArchived: DB_FALSE,
                                schemaVer: MIGRATION_NUMBER,
                            }),
                            //Update each form in each form group to have the logId of the new log entity.
                            db.forms.bulkUpdate(forms.map((f) => ({
                                key: f.id,
                                changes: {
                                    logId,
                                    schemaVer: MIGRATION_NUMBER,
                                    //Delete the names, but leave the most recent one for defensive compatibility with old clients.
                                    name: f.nextVersionId === DB_NULL ? f.name : undefined
                                }
                            })))
                        ]);
                    })
                );

                const logsCount = groups.size;
                const formsCount = Array.from(groups.values()).flat(1).length;

                //Update the schemaVer for each Entry with schemaVer < MIGRATION_NUMBER to MIGRATION_NUMBER
                const entryIds = await db.entries.filter(e => (e.schemaVer ?? 0) === 0).keys();
                const entriesCount = await db.entries.bulkUpdate(entryIds.map(eId => ({
                    key: eId,
                    changes: {
                        schemaVer: MIGRATION_NUMBER,
                    }
                })));

                return [logsCount, formsCount, entriesCount];
            });

            return {
                success: true,
                migrationNumber: MIGRATION_NUMBER,
                message: "Migration 1 was successful",
                counts: {
                    logs,
                    forms,
                    entries,
                }
            }
        }
        catch (e: unknown) {
            //Transaction failed
            const message = e instanceof Error ? e.message : `${e}`;
            return {
                success: false,
                migrationNumber: MIGRATION_NUMBER,
                message: "Migration 1 failed: " + message,
                counts: {
                    //Yay atomicity
                    logs: 0,
                    forms: 0,
                    entries: 0,
                }
            }
        }
    }
} as Migration;

async function getExistingLogIdIfExists(forms: OldFormRaw[], db: AppDexie) {
    const precedingVersionId = forms.at(-1)?.prevVersionId;

    const existingLogId = forms.find(f => f.logId)?.logId ??
        (precedingVersionId ? (await db.forms.get(precedingVersionId))?.logId : undefined);
    return existingLogId;
}
