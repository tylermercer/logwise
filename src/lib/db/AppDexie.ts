import Dexie, { type Table } from 'dexie';
import dexieCloud from "dexie-cloud-addon";
import { PUBLIC_DEXIE_CLOUD_URL } from '$env/static/public';
import type { LogRaw, FormRaw, EntryRaw } from './types';
import type { Widget } from '$lib/widget';

type Schema = {
  [tableName: string]: string | null;
};

export default class AppDexie extends Dexie {
  // 'tables' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  logs!: Table<LogRaw>;
  forms!: Table<FormRaw>;
  entries!: Table<EntryRaw>;
  widgets!: Table<Widget>;

  /**
   * Constructs a new instance of the application database, with the current schema
   * 
   * @param disableEagerSync If set to true, this DB won't set up Cloud eager syncing or other reactive
   *   Cloud features (e.g. websocket)
   * 
   * @param prevVersionSchemaOverrides Allows migrations to shape the schema of this DB instance
   *   as it was at the previous version. E.g. a migration that deletes a table can provide the schema
   *   for that table so that it can access it's data.
   */
  constructor(disableEagerSync: boolean = false, prevVersionSchemaOverrides: Schema = {}) {
    super('main', {
      addons: [dexieCloud],
    });
    this.version(1).stores({
      //Ids are not autoincrementing because we are going to use typeid() instead
      forms: 'id, schemaVer, modifiedDatetime, createdDatetime, logId, prevVersionId, nextVersionId',
      logs: 'id, schemaVer, modifiedDatetime, createdDatetime, currentFormId, isArchived',
      entries: 'id, schemaVer, formId, displayDatetime, createdDatetime, modifiedDatetime',
      widgets: 'id, logId, showOnLog, hideOnHome',
      ...prevVersionSchemaOverrides,
    });
    this.cloud.configure({
      databaseUrl: PUBLIC_DEXIE_CLOUD_URL!,
      //TODO: add service worker support
      tryUseServiceWorker: false && !disableEagerSync,
      requireAuth: false,
      disableEagerSync: disableEagerSync,
      disableWebSocket: disableEagerSync,
      customLoginGui: true,
    });
  }
}
