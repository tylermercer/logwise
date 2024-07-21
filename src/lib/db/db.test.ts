import { beforeEach, expect, test } from 'vitest'
import "fake-indexeddb/auto"; // must import before DB module
import db, { DB_NULL, type FormRaw } from '.';
import { typeid } from 'typeid-unboxed';

beforeEach(() => {
  db.logs.clear();
  db.forms.clear();
  db.entries.clear();
});

test('loading data works', async () => {
  db.forms.bulkAdd([
    {
      id: typeid('form'),
      logId: typeid('log'),
      modifiedDatetime: new Date(),
      createdDatetime: new Date(),
      prevVersionId: DB_NULL,
      nextVersionId: DB_NULL,
      questions: []
    },
    {
      id: typeid('form'),
      logId: typeid('log'),
      modifiedDatetime: new Date(),
      createdDatetime: new Date(),
      prevVersionId: DB_NULL,
      nextVersionId: DB_NULL,
      questions: []
    },
    {
      id: typeid('form'),
      logId: typeid('log'),
      modifiedDatetime: new Date(),
      createdDatetime: new Date(),
      prevVersionId: DB_NULL,
      nextVersionId: DB_NULL,
      questions: []
    },
  ]);
  const count = await db.forms.count();
  expect(count).toBe(3);
});

test('Migrations work properly', async () => {

  const sleepVer1 = typeid('form');
  const sleepVer2 = typeid('form');

  db.forms.bulkAdd([
    {
      id: sleepVer2,
      name: "Sleep",
      modifiedDatetime: new Date(),
      createdDatetime: new Date(),
      prevVersionId: sleepVer1,
      nextVersionId: DB_NULL,
      questions: [
        {
          id: typeid('likert'),
          text: "How well did you sleep?",
        },
        {
          id: typeid('text'),
          text: "Notes",
        },
      ]
    },
    {
      id: sleepVer1,
      name: "Sleep",
      modifiedDatetime: new Date(),
      createdDatetime: new Date(),
      prevVersionId: DB_NULL,
      nextVersionId: sleepVer2,
      questions: [
        {
          id: typeid('likert'),
          text: "How well did you sleep?",
        },
      ]
    },
    {
      id: typeid('form'),
      name: "Favorite moments",
      modifiedDatetime: new Date(),
      createdDatetime: new Date(),
      prevVersionId: DB_NULL,
      nextVersionId: DB_NULL,
      questions: [
        {
          id: typeid('text'),
          text: "What moment do you want to remember?",
        },
      ]
    },
    {
      id: typeid('form'),
      name: "Symptoms",
      modifiedDatetime: new Date(),
      createdDatetime: new Date(),
      prevVersionId: DB_NULL,
      nextVersionId: DB_NULL,
      questions: [
        {
          id: typeid('text'),
          text: "What symptoms are you experiencing?",
        },]
    },
  ] as unknown as FormRaw[]);
  const count = await db.forms.where('logId').startsWith('log_').count();
  expect(count, "Some records were not migrated").toBe(3);
});