import { makeTypeGuard, type BaseQuestion } from "../";

export const isTextQuestion = makeTypeGuard<TextQuestion>('text');

export interface TextQuestion extends BaseQuestion<'text'> {}