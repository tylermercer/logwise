import { type TypeID } from 'typeid-unboxed';

export interface BaseQuestion<T extends string> {
    text: string;
    id: TypeID<T>; //uuid prefixed with type
}