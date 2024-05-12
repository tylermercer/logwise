import { getType, type TypeID } from 'typeid-unboxed';
import type { TextQuestion } from './text/textQuestion';
import type { LikertQuestion } from './likert/likertQuestion';

export interface BaseQuestion<T extends string> {
    text: string;
    id: TypeID<T>; //uuid prefixed with type
}

//Funky formatting for git-friendliness
export type Question =
  TextQuestion
  | LikertQuestion
  ;

export	type DraftQuestion = { tempId: string; type: 'text' | 'likert'; data: Omit<Question, 'id'> };

export function makeTypeGuard<QType extends Question>(idType: string) {
    return (q: Question): q is QType => getType(q.id) == idType;
}