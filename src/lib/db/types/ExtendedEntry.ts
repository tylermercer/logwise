import type { EntryRaw, FormRaw, LogRaw } from "../AppDexie";

export type ExtendedEntry = EntryRaw & { form: FormRaw; log: LogRaw };