import type AppDexie from "../AppDexie";

export interface Migration {
    migrate(db: AppDexie): Promise<MigrationResult>
}

export interface MigrationResult {
    success: boolean,
    migrationNumber: number,
    message?: string | undefined,
    counts: {
        logs?: number | undefined,
        forms?: number | undefined,
        entries?: number | undefined,
    },
}