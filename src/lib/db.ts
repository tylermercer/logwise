import Dexie, { type Table } from 'dexie';
import dexieCloud from "dexie-cloud-addon";
import { type TypeID } from 'typeid-unboxed';
import { PUBLIC_DEXIE_CLOUD_URL } from '$env/static/public';
import type { TextQuestion } from './question-types/text/textQuestion';
import type { LikertQuestion } from './question-types/likert/likertQuestion';

//Funky formatting for git-friendliness
export type Question =
  TextQuestion
  | LikertQuestion
  ;

export type QuestionId = Question['id']

export type ThingId = TypeID<'thing'>

export const DB_NULL = 'NULL';

export type DbNull = typeof DB_NULL;

export interface ThingRaw {
  id: ThingId; //uuid
  name: string;
  modifiedDatetime: Date;
  createdDatetime: Date;
  prevVersionId: ThingId | DbNull;
  nextVersionId: ThingId | DbNull;
  questions: Question[];
}


export interface EntryRaw {
  id: TypeID<'entry'>; //uuid
  displayDatetime: Date;
  modifiedDatetime: Date;
  createdDatetime: Date;
  thingId: ThingId;
  answers: Map<QuestionId, any>; //Question ID -> answer contents
}

export class LogThingDexie extends Dexie {
  // 'tables' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  things!: Table<ThingRaw>;
  entries!: Table<EntryRaw>;

  constructor() {
    super('main', {
      addons: [dexieCloud],
    });
    this.version(1).stores({
      //Ids are not autoincrementing because we are going to use typeid() instead
      things: 'id, name, modifiedDatetime, createdDatetime, prevVersionId, nextVersionId',
      entries: 'id, thingId, displayDatetime, createdDatetime, modifiedDatetime'
    });
    this.cloud.configure({
      databaseUrl: PUBLIC_DEXIE_CLOUD_URL!,
      tryUseServiceWorker: false,
      requireAuth: false,
    });
  }
}

const db = new LogThingDexie();

//Note that this invokes db.open() when the module is loaded
export const dbOpenPromise = new Promise<void>(r => db.open().then(() => r()));

export default db;
