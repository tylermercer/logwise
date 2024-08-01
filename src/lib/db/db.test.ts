import { beforeEach, expect, test } from 'vitest'
import "fake-indexeddb/auto"; // must import before DB module
import db, { DB_CURRENT_ENTITY_VERSION, DB_FALSE, DB_NULL, DB_TRUE, dbOpenPromise, type FormRaw } from './index';
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

  const symptomsVer1 = typeid('form');

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
    //Form where nextVersion was deleted -- should become archived log
    {
      id: symptomsVer1,
      name: "Symptoms",
      schemaVer: 0,
      modifiedDatetime: new Date(),
      createdDatetime: new Date(),
      prevVersionId: DB_NULL,
      nextVersionId: typeid('form'),
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
  expect(
    (await db.logs.where('currentFormId').equals(symptomsVer1).first())?.isArchived,
    "Form with next version that was deleted should become archived log",
  ).toBe(DB_TRUE);
  expect(
    (await db.logs.where('currentFormId').equals(sleepVer2).first())?.isArchived,
    "Form with next version that was NOT deleted should become NON-archived log",
  ).toBe(DB_FALSE);
});

test('Migrations handle partially-migrated data', async () => {

  //Arrange
  const focusVer1 = typeid('form');
  const focusVer2 = typeid('form');
  const focusVer3 = typeid('form');

  const focusLogId = typeid('log');

  db.forms.bulkAdd([
    {
      id: focusVer3,
      schemaVer: 0,
      name: "Focus",
      modifiedDatetime: getDateFromDaysAgo(0),
      createdDatetime: getDateFromDaysAgo(0),
      prevVersionId: focusVer2,
      nextVersionId: DB_NULL,
      questions: [
        {
          id: typeid('likert'),
          text: "How focused do you feel right now?",
        },
        {
          id: typeid('text'),
          text: "Notes",
        },
      ]
    },
    {
      id: focusVer2,
      schemaVer: 0,
      name: "Focus",
      modifiedDatetime: getDateFromDaysAgo(1),
      createdDatetime: getDateFromDaysAgo(1),
      prevVersionId: focusVer1,
      nextVersionId: focusVer3,
      questions: [
        {
          id: typeid('likert'),
          text: "How focused were you today?",
        },
        {
          id: typeid('text'),
          text: "Notes",
        },
      ]
    },
    {
      id: focusVer1,
      name: "Focus",
      schemaVer: 1,
      modifiedDatetime: getDateFromDaysAgo(2),
      createdDatetime: getDateFromDaysAgo(2),
      prevVersionId: DB_NULL,
      nextVersionId: focusVer2,
      logId: focusLogId,
      questions: [
        {
          id: typeid('likert'),
          text: "How focused were you today?",
        },
      ]
    },
  ] as unknown as FormRaw[]);

  db.logs.add({
    id: focusLogId,
    name: "Focus",
    color: "gray",
    currentFormId: focusVer1,
    description: "",
    isArchived: DB_FALSE,
    modifiedDatetime: getDateFromDaysAgo(2),
    createdDatetime: getDateFromDaysAgo(2),
    schemaVer: 1,
  });

  //Act
  const result = await runMigrationsIfNeeded();

  //Assert
  expect(
    result.counts.forms,
    "Two prev-ver forms should be migrated"
  ).toBe(2);
  expect(
    result.counts.logs,
    "Existing form should be updated",
  ).toBe(1);
  expect(
    await db.forms.where('logId').startsWith('log_').count(),
    "Some forms were not linked to their logs"
  ).toBe(3);
  expect(
    await db.forms.where('schemaVer').equals(DB_CURRENT_ENTITY_VERSION).count(),
    "Some forms were not given the correct schemaVer"
  ).toBe(3);
  expect(
    await db.logs.count(),
    "Existing focus log was not preserved"
  ).toBe(1);
  expect(
    (await db.logs.get(focusLogId))?.currentFormId,
    "Existing log was not updated to point to latest form",
  ).toEqual(focusVer3);
  expect(
    await db.logs.where('currentFormId').startsWith('form_').count(),
    "Some logs were not properly linked to their forms"
  ).toBe(1);
  expect(
    await db.logs.where('schemaVer').equals(DB_CURRENT_ENTITY_VERSION).count(),
    "Some logs were not given the correct schemaVer"
  ).toBe(1);
  const logNames = (await db.logs.toArray()).map(l => l.name);
  expect(
    logNames,
    "Focus form was not migrated",
  ).toContain("Focus");
  expect(
    (await db.forms.get(focusVer1))?.logId,
    "Partially migrated Focus form version 1 should point to existing Focus log",
  ).toEqual(focusLogId);
  expect(
    (await db.forms.get(focusVer2))?.logId,
    "Partially migrated Focus form version 2 should point to existing Focus log",
  ).toEqual(focusLogId);
});

function getDateFromDaysAgo(daysAgo: number) {
  return new Date(new Date().getTime() - daysAgo * 24 * 60 * 60 * 1000);
}
