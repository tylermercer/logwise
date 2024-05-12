import { makeTypeGuard, type BaseQuestion } from "../";

export const isLikertQuestion = makeTypeGuard<LikertQuestion>('likert');

export interface LikertQuestion extends BaseQuestion<'likert'> {}
