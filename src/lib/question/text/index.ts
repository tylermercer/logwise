import { makeAnsweredTypeGuard, makeTypeGuard, type BaseQuestion } from "../";

export const isTextQuestion = makeTypeGuard<TextQuestion>('text');

export const isAnsweredTextQuestion = makeAnsweredTypeGuard<AnsweredTextQuestion>('text');

export interface TextQuestion extends BaseQuestion<'text'> {}

export interface AnsweredTextQuestion {
    question: TextQuestion;
    answer: string
}
