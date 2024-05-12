import { getType, type TypeID } from 'typeid-unboxed';
import { isTextQuestion, type TextQuestion, type AnsweredTextQuestion } from './text';
import { isLikertQuestion, type LikertQuestion, type AnsweredLikertQuestion } from './likert';
import { isBoolQuestion, type BoolQuestion, type AnsweredBoolQuestion } from './bool';
import assertNever from '$lib/util/assertNever';

export interface BaseQuestion<T extends string> {
    text: string;
    id: TypeID<T>; //uuid prefixed with type
}

//Funky formatting for git-friendliness
export type Question =
  TextQuestion
  | LikertQuestion
  | BoolQuestion
  ;

export type AnsweredQuestion =
AnsweredTextQuestion
  | AnsweredLikertQuestion
  | AnsweredBoolQuestion
  ;

export type ExtractType<TQuestion extends Question> = TQuestion extends BaseQuestion<infer T> ? T : never;

type QuestionType = ExtractType<Question>;

export	type DraftQuestion = { tempId: string; type: QuestionType; data: Omit<Question, 'id'> };

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
  else if (isBoolQuestion(question)) {
    return {
      question,
      answer: false,
    }
  }
  else {
    return assertNever(question);
  }
}