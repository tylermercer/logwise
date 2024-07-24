import { derived, writable } from "svelte/store";
import db, { DB_CURRENT_ENTITY_VERSION } from ".."
import type { Migration, MigrationResult } from "./types";

const emptyMigrationResult = {
    success: true,
    migrationNumber: -1,
    counts: {},
} as MigrationResult;

const emptyMigrationResultPromise = Promise.resolve(emptyMigrationResult);

const latestMigrationResultStore = writable(emptyMigrationResult);

export const latestMigrationResult = derived(latestMigrationResultStore, x => x);

export let runningMigrationsPromise = emptyMigrationResultPromise;

async function runNeededMigrations(): Promise<MigrationResult> {
    const currentMinVersion = 0; // TODO: get from DB

    if (currentMinVersion < DB_CURRENT_ENTITY_VERSION) {
        return await
            // Array with length = number of migrations to run
            (new Array(DB_CURRENT_ENTITY_VERSION - currentMinVersion)).fill(0)
                // Import all needed migrations
                .map((_, i) => importMigration(i + currentMinVersion + 1))
                // Chain promises of imports and migrates in order, short-circuiting if a migration fails
                .reduce(async (chain: Promise<MigrationResult>, migrationImport: Promise<Migration>) => {

                    const prevResult = await chain;

                    if (!prevResult.success) return prevResult;

                    const migration = await migrationImport;
                    const result = await migration.migrate();

                    return combineResults(result, prevResult);

                }, emptyMigrationResultPromise);
    }
    else {
        return await emptyMigrationResultPromise;
    }
}

export async function runMigrationsIfNeeded() {
    await runningMigrationsPromise;
    runningMigrationsPromise = runNeededMigrations();
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