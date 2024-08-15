import type { FormRaw, LogRaw } from "../types";

export type ExtendedLog = LogRaw & { currentForm: FormRaw };