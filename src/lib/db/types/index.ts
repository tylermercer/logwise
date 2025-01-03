import { type TypeID } from 'typeid-unboxed';
import type { Question } from '../../question';

export type QuestionId = Question['id']

export type FormId = TypeID<'form'>
export type LogId = TypeID<'log'>
export type EntryId = TypeID<'entry'>

export const DB_CURRENT_ENTITY_VERSION = 1;

export const DB_NULL = 'NULL';

export type DbNull = typeof DB_NULL;

export const DB_FALSE = 0;
export const DB_TRUE = 1;

export type DbBool = typeof DB_FALSE | typeof DB_TRUE;

export interface VersionedSchemaEntity {
  /**
   * The schema version of this entity. If undefined, the version is assumed to be 0.
   */
  schemaVer: number;
}

export interface FormRaw extends VersionedSchemaEntity {
  id: FormId; //uuid
  logId: LogId;
  modifiedDatetime: Date;
  createdDatetime: Date;
  prevVersionId: FormId | DbNull;
  nextVersionId: FormId | DbNull;
  questions: Question[];
}

export interface LogRaw extends VersionedSchemaEntity {
  id: LogId; //uuid
  currentFormId: FormId;
  modifiedDatetime: Date;
  createdDatetime: Date;
  isArchived: DbBool;
  name: string;
  description: string;
  color: 'gray'; //TODO: add other colors
}

export interface EntryRaw extends VersionedSchemaEntity {
  id: EntryId; //uuid
  formId: FormId;
  displayDatetime: Date;
  modifiedDatetime: Date;
  createdDatetime: Date;
  answers: Map<QuestionId, any>; //Question ID -> answer contents
}