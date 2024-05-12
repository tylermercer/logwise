import { getType, type TypeID } from 'typeid-unboxed';
import { isTextQuestion, type TextQuestion, type AnsweredTextQuestion } from './text';
import { isLikertQuestion, type LikertQuestion, type AnsweredLikertQuestion } from './likert';
import assertNever from '$lib/util/assertNever';

export interface BaseQuestion<T extends string> {
    text: string;
    id: TypeID<T>; //uuid prefixed with type
}

//Funky formatting for git-friendliness
export type Question =
  TextQuestion
  | LikertQuestion
  ;

export type AnsweredQuestion =
AnsweredTextQuestion
  | AnsweredLikertQuestion
  ;

export	type DraftQuestion = { tempId: string; type: 'text' | 'likert'; data: Omit<Question, 'id'> };

export function makeTypeGuard<QType extends Question>(idType: string) {
    return (q: Question): q is QType => getType(q.id) == idType;
}

export function makeAnsweredTypeGuard<QType extends AnsweredQuestion>(idType: string) {
  return (q: AnsweredQuestion): q is QType => getType(q.question.id) == idType;
}

export function toAnsweredQuestion(question: Question): AnsweredQuestion {
  if (isTextQuestion(question)) {
    return {
      question,
      answer: '',
    }
  }
  else if (isLikertQuestion(question)) {
    return {
      question,
      answer: 3
    }
  }
  else {
    return assertNever(question);
  }
}