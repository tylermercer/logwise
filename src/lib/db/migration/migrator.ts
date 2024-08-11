import { derived, writable } from "svelte/store";
import { DB_CURRENT_ENTITY_VERSION, type VersionedSchemaEntity } from "../types"
import type { Migration, MigrationResult } from "./types";
import type { Table } from "dexie";
import AppDexie from "../AppDexie";

const emptyMigrationResult = {
    success: true,
    migrationNumber: -1,
    counts: {},
} as MigrationResult;

const emptyMigrationResultPromise = Promise.resolve(emptyMigrationResult);

const latestMigrationResultStore = writable(emptyMigrationResult);

export const latestMigrationResult = derived(latestMigrationResultStore, x => x);

export let runningMigrationsPromise = emptyMigrationResultPromise;

async function runNeededMigrations(upTo?: number | undefined): Promise<MigrationResult> {

    const db = new AppDexie(true);

    const targetVersion = upTo ?? DB_CURRENT_ENTITY_VERSION;

    /*
     * Because this is run outside the migration transaction, there's technically a possibility for
     * the currentMinVersion to change after this query. Fortunately, our migrations are idempotent,
     * so we don't need to worry about that.
     * 
     * We can't put this in the same transaction because we need to do the dynamic import, which can't
     * be done within an IDB transaction 
     */
    const currentMinVersion = Math.min(
        ...((await Promise.all(
            db.tables
                .filter(t => t.schema.idxByName['schemaVer'])
                .map(async (t: Table<VersionedSchemaEntity>) => {
                    const allCount = (await t.count())
                    if (allCount > 0) {
                        const withSchemaVerCount = (await t.orderBy('schemaVer').count());
                        return (withSchemaVerCount < allCount) ? 0 : (await t.orderBy('schemaVer').first())?.schemaVer ?? 0;
                    }
                    else {
                        return targetVersion;
                    }
                })
        )))
    );
    if (currentMinVersion < targetVersion) {
        // Array of migration numbers
        const migrationsToRun = (new Array(targetVersion - currentMinVersion))
            .fill(0)
            .map(i => i + currentMinVersion + 1);

        console.log("Running migrations:", migrationsToRun);

        const migrations = await Promise.all(migrationsToRun.map(importMigration));

        return await db.transaction('rw', db.tables,
            // Chain migrates in order, short-circuiting if a migration fails
            async () => migrations.reduce(
                async (chain: Promise<MigrationResult>, migration: Migration) => {

                    const prevResult = await chain;

                    if (!prevResult.success) return prevResult;

                    const result = await migration.migrate(db);

                    return combineResults(result, prevResult);

                },
                emptyMigrationResultPromise
            )
        );
    }
    else {
        return await emptyMigrationResultPromise;
    }
}

export async function runMigrationsIfNeeded(upTo?: number | undefined) {
    await runningMigrationsPromise;
    runningMigrationsPromise = runNeededMigrations(upTo);
    return runningMigrationsPromise;
}

async function importMigration(migrationNumber: number): Promise<Migration> {
    const module = await import(`./migrations/${String(migrationNumber).padStart(5, '0')}.ts`);
    return module.default;
}

function combineResults(current: MigrationResult, prev: MigrationResult): MigrationResult {
    return {
        success: current.success && prev.success,
        migrationNumber: current.migrationNumber,
        message: [prev.message, current.message].filter(m => m).join('/n'),
        counts: {
            logs: (current.counts.logs ?? 0) + (prev.counts.logs ?? 0),
            forms: (current.counts.forms ?? 0) + (prev.counts.forms ?? 0),
            entries: (current.counts.entries ?? 0) + (prev.counts.entries ?? 0),
        }
    }
}