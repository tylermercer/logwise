import { expect, test } from 'vitest'
import "fake-indexeddb/auto"; // must import before DB module
import db, { DB_NULL } from '.';
import { typeid } from 'typeid-unboxed';

test('adds 1 + 2 to equal 3', () => {
  expect(1+2).toBe(3)
})

test('loading data works', async () => {
  db.forms.bulkAdd([
    {
      id: typeid('form'),
      name: 'Test form 1',
      modifiedDatetime: new Date(),
      createdDatetime: new Date(),
      prevVersionId: DB_NULL,
      nextVersionId: DB_NULL,
      questions: []
    },
    {
      id: typeid('form'),
      name: 'Test form 2',
      modifiedDatetime: new Date(),
      createdDatetime: new Date(),
      prevVersionId: DB_NULL,
      nextVersionId: DB_NULL,
      questions: []
    },
    {
      id: typeid('form'),
      name: 'Test form 3',
      modifiedDatetime: new Date(),
      createdDatetime: new Date(),
      prevVersionId: DB_NULL,
      nextVersionId: DB_NULL,
      questions: []
    },
  ]);
  const count = await db.forms.count();
  expect(count).toBe(3);
})