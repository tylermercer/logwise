import Dexie, { type Table } from 'dexie';
import dexieCloud from "dexie-cloud-addon";
import { type TypeID } from 'typeid-unboxed';
import { PUBLIC_DEXIE_CLOUD_URL } from '$env/static/public';

export type Question = {
  text: string
} & ({
  id: TypeID<'text'>; //uuid prefixed with type
} | {
  id: TypeID<'likert'>; //uuid prefixed with type
});

export type QuestionId = Question['id']

export type TemplateId = TypeID<'template'>

export const DB_NULL = 'NULL';

export type DbNull = typeof DB_NULL;

export interface TemplateRaw {
  id: TemplateId; //uuid
  name: string;
  modifiedDatetime: Date;
  createdDatetime: Date;
  prevVersionId: TemplateId | DbNull;
  nextVersionId: TemplateId | DbNull;
  questions: Question[];
}


export interface EntryRaw {
  id: TypeID<'entry'>; //uuid
  displayDatetime: Date;
  modifiedDatetime: Date;
  createdDatetime: Date;
  templateId: TemplateId;
  answers: Map<QuestionId, any>; //Question ID -> answer contents
}

export class LogThingDexie extends Dexie {
  // 'tables' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  templates!: Table<TemplateRaw>;
  entries!: Table<EntryRaw>;

  constructor() {
    super('main', {
      addons: [dexieCloud],
    });
    this.version(1).stores({
      //Ids are not autoincrementing because we are going to use typeid() instead
      templates: 'id, name, modifiedDatetime, createdDatetime, prevVersionId, nextVersionId',
      entries: 'id, templateId, displayDatetime, createdDatetime, modifiedDatetime'
    });
    this.cloud.configure({
      databaseUrl: PUBLIC_DEXIE_CLOUD_URL!,
      tryUseServiceWorker: true, // true!
      requireAuth: false,
    });
  }
}

const db = new LogThingDexie();

export default db;