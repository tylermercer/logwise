import { beforeEach, expect, test } from 'vitest'
import "fake-indexeddb/auto"; // must import before DB module
import db, { DB_CURRENT_ENTITY_VERSION, DB_NULL, dbOpenPromise, type FormRaw } from './index';
import { typeid } from 'typeid-unboxed';
import { runMigrationsIfNeeded, runningMigrationsPromise } from './migration/migrator';

beforeEach(async () => {
  await dbOpenPromise;
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
      schemaVer: 0,
      questions: []
    },
    {
      id: typeid('form'),
      logId: typeid('log'),
      modifiedDatetime: new Date(),
      createdDatetime: new Date(),
      prevVersionId: DB_NULL,
      nextVersionId: DB_NULL,
      schemaVer: 0,
      questions: []
    },
    {
      id: typeid('form'),
      logId: typeid('log'),
      modifiedDatetime: new Date(),
      createdDatetime: new Date(),
      prevVersionId: DB_NULL,
      nextVersionId: DB_NULL,
      schemaVer: 0,
      questions: []
    },
  ]);
  const count = await db.forms.count();
  expect(count).toBe(3);
});

test('Migrations work properly', async () => {

  //Arrange
  const sleepVer1 = typeid('form');
  const sleepVer2 = typeid('form');


  db.forms.bulkAdd([
    {
      id: sleepVer2,
      schemaVer: 0,
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
      schemaVer: 0,
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
      schemaVer: 0,
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
      schemaVer: 0,
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

  //Act
  const result = await runMigrationsIfNeeded();

  //Assert
  expect(
    result.counts.forms,
    "Old forms should be migrated"
  ).toBe(4);
  expect(
    await db.forms.where('logId').startsWith('log_').count(),
    "Some forms were not linked to their logs"
  ).toBe(4);
  expect(
    await db.forms.where('schemaVer').equals(DB_CURRENT_ENTITY_VERSION).count(),
    "Some forms were not given the correct schemaVer"
  ).toBe(4);
  expect(
    await db.logs.count(),
    "Some logs were not created"
  ).toBe(3);
  expect(
    await db.logs.where('currentFormId').startsWith('form_').count(),
    "Some logs were not properly linked to their forms"
  ).toBe(3);
  expect(
    await db.logs.where('schemaVer').equals(DB_CURRENT_ENTITY_VERSION).count(),
    "Some logs were not given the correct schemaVer"
  ).toBe(3);
  const logNames = (await db.logs.toArray()).map(l => l.name);
  expect(
    logNames,
    "Sleep form was not migrated",
  ).toContain("Sleep");
  expect(
    logNames,
    "Symptoms form was not migrated",
  ).toContain("Symptoms");
  expect(
    logNames,
    "Favorite moments form was not migrated",
  ).toContain("Favorite moments");
});