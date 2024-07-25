/**
 * Like Omit<Type, Keys>, but renders the Keys optional instead of removing them
 */
export type PartialPick<T, F extends keyof T> = Omit<T, F> & Partial<Pick<T, F>>;