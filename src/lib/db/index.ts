import { browser, dev } from "$app/environment";
import AppDexie from "./AppDexie";
import { runMigrationsIfNeeded } from "./migration/migrator";

const db = new AppDexie(dev);

//Note that this invokes db.open() when the module is loaded
export const dbOpenPromise = new Promise<void>(r => db.open()
  .then(() => r()))
  .then(() => runMigrationsIfNeeded())
  .then(() => db.cloud.events.syncComplete.subscribe(() => runMigrationsIfNeeded()));

if (dev && browser) {
  const devWindow = window as any;
  devWindow.db = db;
  devWindow.runMigrationsIfNeeded = runMigrationsIfNeeded;
  devWindow.pull = () => db.cloud.sync({purpose: 'pull', wait: true});
  devWindow.push = () => db.cloud.sync({purpose: 'push', wait: true});
}

export default db;