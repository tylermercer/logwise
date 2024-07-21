import Dexie, { type Table } from 'dexie';
import dexieCloud from "dexie-cloud-addon";
import { type TypeID } from 'typeid-unboxed';
import { PUBLIC_DEXIE_CLOUD_URL } from '$env/static/public';
import type { Question } from '../question';
import { runMigrationsIfNeeded } from './migration/migrator';

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
   * The schema version of this entity.
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

export class AppDexie extends Dexie {
  // 'tables' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  logs!: Table<LogRaw>;
  forms!: Table<FormRaw>;
  entries!: Table<EntryRaw>;

  constructor() {
    super('main', {
      addons: [dexieCloud],
    });
    this.version(1).stores({
      //Ids are not autoincrementing because we are going to use typeid() instead
      forms: 'id, schemaVer, modifiedDatetime, createdDatetime, logId, prevVersionId, nextVersionId',
      logs: 'id, schemaVer, modifiedDatetime, createdDatetime, currentFormId, isArchived',
      entries: 'id, schemaVer, formId, displayDatetime, createdDatetime, modifiedDatetime'
    });
    this.cloud.configure({
      databaseUrl: PUBLIC_DEXIE_CLOUD_URL!,
      tryUseServiceWorker: false,
      requireAuth: false,
      customLoginGui: true,
    });
  }
}

const db = new AppDexie();

//Note that this invokes db.open() when the module is loaded
export const dbOpenPromise = new Promise<void>(r => db.open()
  .then(() => r()))
  .then(runMigrationsIfNeeded);

export default db;
