export interface Migration {
    migrate(): Promise<MigrationResult>
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