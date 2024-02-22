import Dexie, { type Table } from 'dexie';

export type Uuid = `${string}-${string}-${string}-${string}-${string}`;

export type Question = {
  text: string
} & ({
  id: `text_${Uuid}`; //uuid prefixed with type
} | {
  id: `likert_${Uuid}`; //uuid prefixed with type
});

type QuestionId = Question['id']

export interface TemplateRaw {
  id: Uuid; //uuid
  name: string;
  modifiedDatetime: Date;
  createdDatetime: Date;
  prevVersionId?: Uuid;
  questions: Question[];
}

export type TemplateId = TemplateRaw['id']

export interface EntryRaw {
  id: Uuid; //uuid
  name: string;
  displayDatetime: Date;
  modifiedDatetime: Date;
  createdDatetime: Date;
  templateId: string;
  answers: Record<QuestionId, any>; //Question ID -> answer contents
}

export class LogThingDexie extends Dexie {
  // 'tables' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  templates!: Table<TemplateRaw>;
  entries!: Table<EntryRaw>;

  constructor() {
    super('main');
    this.version(1).stores({
      //Ids are not autoincrementing because we are going to use crypto.randomUUID instead
      templates: 'id, name, modifiedDatetime, createdDatetime, prevVersionId',
      entries: 'id, templateId, displayDatetime, createdDatetime, modifiedDatetime'
    });
  }
}

const db = new LogThingDexie();

export default db;