import type { EntryRaw, FormRaw, LogRaw } from "../types";

export type ExtendedEntry = EntryRaw & { form: FormRaw; log: LogRaw };