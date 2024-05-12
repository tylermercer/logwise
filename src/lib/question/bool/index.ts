import { makeAnsweredTypeGuard, makeTypeGuard, type BaseQuestion } from "..";

export const isBoolQuestion = makeTypeGuard<BoolQuestion>('bool');

export const isAnsweredBoolQuestion = makeAnsweredTypeGuard<AnsweredBoolQuestion>('bool');

export interface BoolQuestion extends BaseQuestion<'bool'> {}

export interface AnsweredBoolQuestion {
    question: BoolQuestion;
    answer: boolean
}