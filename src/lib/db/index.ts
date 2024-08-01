import { browser, dev } from "$app/environment";
import AppDexie, {
  DB_CURRENT_ENTITY_VERSION,
  DB_FALSE,
  DB_NULL,
  DB_TRUE,
  type DbBool,
  type DbNull,
  type EntryId,
  type EntryRaw,
  type FormId,
  type FormRaw,
  type LogId,
  type LogRaw,
  type QuestionId,
  type VersionedSchemaEntity,
} from "./AppDexie";
import { runMigrationsIfNeeded } from "./migration/migrator";

export {
  DB_CURRENT_ENTITY_VERSION,
  DB_FALSE,
  DB_NULL,
  DB_TRUE,
  type DbBool,
  type DbNull,
  type EntryId,
  type EntryRaw,
  type FormId,
  type FormRaw,
  type LogId,
  type LogRaw,
  type QuestionId,
  type VersionedSchemaEntity,
}

const db = new AppDexie(dev);

//Note that this invokes db.open() when the module is loaded
export const dbOpenPromise = new Promise<void>(r => db.open()
  .then(() => r()))
  .then(runMigrationsIfNeeded)
  .then(() => db.cloud.events.syncComplete.subscribe(() => runMigrationsIfNeeded()));

if (dev && browser) {
  const devWindow = window as any;
  devWindow.db = db;
  devWindow.runMigrationsIfNeeded = runMigrationsIfNeeded;
  devWindow.pull = () => db.cloud.sync({purpose: 'pull', wait: true});
  devWindow.push = () => db.cloud.sync({purpose: 'push', wait: true});
}

export default db;