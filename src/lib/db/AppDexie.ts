import Dexie, { type Table } from 'dexie';
import dexieCloud from "dexie-cloud-addon";
import { type TypeID } from 'typeid-unboxed';
import { PUBLIC_DEXIE_CLOUD_URL } from '$env/static/public';
import type { Question } from '../question';
import setCurrentSchemaVerMiddleware from './setCurrentSchemaVerMiddleware';

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
   * 
   * Optional for convenience; set by setCurrentSchemaVerMiddleware
   */
  schemaVer?: number;
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

type Schema = {
  [tableName: string]: string | null;
};

export default class AppDexie extends Dexie {
  // 'tables' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  logs!: Table<LogRaw>;
  forms!: Table<FormRaw>;
  entries!: Table<EntryRaw>;

  /**
   * Constructs a new instance of the application database, with the current schema
   * 
   * @param disableEagerSync If set to true, this DB won't set up Cloud eager syncing or other reactive
   *   Cloud features (e.g. websocket)
   * 
   * @param prevVersionSchemaOverrides Allows migrations to shape the schema of this DB instance
   *   as it was at the previous version. E.g. a migration that deletes a table can provide the schema
   *   for that table so that it can access it's data.
   */
  constructor(disableEagerSync: boolean = false, prevVersionSchemaOverrides: Schema = {}) {
    super('main', {
      addons: [dexieCloud],
    });
    this.use(setCurrentSchemaVerMiddleware);
    this.version(1).stores({
      //Ids are not autoincrementing because we are going to use typeid() instead
      forms: 'id, schemaVer, modifiedDatetime, createdDatetime, logId, prevVersionId, nextVersionId',
      logs: 'id, schemaVer, modifiedDatetime, createdDatetime, currentFormId, isArchived',
      entries: 'id, schemaVer, formId, displayDatetime, createdDatetime, modifiedDatetime',
      ...prevVersionSchemaOverrides,
    });
    this.cloud.configure({
      databaseUrl: PUBLIC_DEXIE_CLOUD_URL!,
      //TODO: add service worker support
      tryUseServiceWorker: false && !disableEagerSync,
      requireAuth: false,
      disableEagerSync: disableEagerSync,
      disableWebSocket: disableEagerSync,
      customLoginGui: true,
    });
  }
}
