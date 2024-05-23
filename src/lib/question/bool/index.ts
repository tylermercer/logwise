import {
    makeAnsweredTypeGuard,
    makeTypeGuard,
    type BaseAnsweredQuestion,
    type BaseQuestion
} from "..";

export const isBoolQuestion = makeTypeGuard<BoolQuestion>('bool');

export const isAnsweredBoolQuestion = makeAnsweredTypeGuard<AnsweredBoolQuestion>('bool');

export interface BoolQuestion extends BaseQuestion<'bool'> {}

export interface AnsweredBoolQuestion extends BaseAnsweredQuestion<BoolQuestion, boolean> {}