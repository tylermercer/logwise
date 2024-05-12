import { makeAnsweredTypeGuard, makeTypeGuard, type BaseQuestion } from "../";

export const isLikertQuestion = makeTypeGuard<LikertQuestion>('likert');

export const isAnsweredLikertQuestion = makeAnsweredTypeGuard<AnsweredLikertQuestion>('likert');

export interface LikertQuestion extends BaseQuestion<'likert'> {}

export interface AnsweredLikertQuestion {
    question: LikertQuestion;
    answer: number
}