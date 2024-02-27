import Dexie, { type Table } from 'dexie';
import {TypeID } from 'typeid-js';

export type Question = {
  text: string
} & ({
  id: TypeID<'text'>; //uuid prefixed with type
} | {
  id: TypeID<'likert'>; //uuid prefixed with type
});

export type QuestionId = Question['id']

export type TemplateId = TypeID<'template'>

export interface TemplateRaw {
  id: TemplateId; //uuid
  name: string;
  modifiedDatetime: Date;
  createdDatetime: Date;
  prevVersionId?: TemplateId;
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
    super('main');
    this.version(1).stores({
      //Ids are not autoincrementing because we are going to use typeid() instead
      templates: 'id, name, modifiedDatetime, createdDatetime, prevVersionId',
      entries: 'id, templateId, displayDatetime, createdDatetime, modifiedDatetime'
    });
  }
}

const db = new LogThingDexie();

export default db;