import Dexie, { type Table } from 'dexie';
import dexieCloud from "dexie-cloud-addon";
import { type TypeID } from 'typeid-unboxed';
import { PUBLIC_DEXIE_CLOUD_URL } from '$env/static/public';
import type { Question } from './question';
import { exportDB } from "dexie-export-import";
import type { ImportProgress } from 'dexie-export-import/dist/import';

export type QuestionId = Question['id']

export type FormId = TypeID<'form'>

export const DB_NULL = 'NULL';

export type DbNull = typeof DB_NULL;

export interface FormRaw {
  id: FormId; //uuid
  name: string;
  modifiedDatetime: Date;
  createdDatetime: Date;
  prevVersionId: FormId | DbNull;
  nextVersionId: FormId | DbNull;
  questions: Question[];
}


export interface EntryRaw {
  id: TypeID<'entry'>; //uuid
  displayDatetime: Date;
  modifiedDatetime: Date;
  createdDatetime: Date;
  formId: FormId;
  answers: Map<QuestionId, any>; //Question ID -> answer contents
}

export class AppDexie extends Dexie {
  // 'tables' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  forms!: Table<FormRaw>;
  entries!: Table<EntryRaw>;

  constructor() {
    super('main', {
      addons: [dexieCloud],
    });
    this.version(1).stores({
      //Ids are not autoincrementing because we are going to use typeid() instead
      forms: 'id, name, modifiedDatetime, createdDatetime, prevVersionId, nextVersionId',
      entries: 'id, formId, displayDatetime, createdDatetime, modifiedDatetime'
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
export const dbOpenPromise = new Promise<void>(r => db.open().then(() => r()));

export const exportToFile = async (progressCallback: (progress: ImportProgress) => boolean) => {
  return await exportDB(db, {
    progressCallback
  });
}

export default db;
