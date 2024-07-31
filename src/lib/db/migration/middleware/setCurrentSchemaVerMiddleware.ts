import type { DBCore, DBCoreMutateRequest, Middleware } from "dexie";
import { DB_CURRENT_ENTITY_VERSION, type VersionedSchemaEntity } from "../..";

/**
 * This middleware set the schemaVer field for forms, logs, and entries when they are mutated
 */
export default {
    stack: "dbcore", // The only stack supported so far.
    name: "setCurrentSchemaVerMiddleware", // Optional name of your middleware
    create(downlevelDatabase) {
        return {
            ...downlevelDatabase,
            table(tableName) {
                const downlevelTable = downlevelDatabase.table(tableName);
                return {
                    ...downlevelTable,
                    mutate: async (req: DBCoreMutateRequest) => {
                        // Set entityVer for all mutations that set values (each value is a record);
                        if ('values' in req) {
                            req.values = req.values.map((v: VersionedSchemaEntity & { id?: string }, i: number) => {
                                //Get key from keys if put or from id if add
                                const key = req.keys?.at(i) as string | undefined ?? v.id;
                                //Only transform forms, logs, and entries
                                if (!key || !(key.startsWith('form_') || key.startsWith('log_') || key.startsWith('entry_'))) {
                                    return v;
                                }
                                console.log("Setting schema ver to 1 for " + key);
                                return ({
                                    ...v,
                                    //Only set schemaVer if it's not explicitly set
                                    schemaVer: v.schemaVer ?? DB_CURRENT_ENTITY_VERSION
                                });
                            });
                        }

                        return await downlevelTable.mutate(req);
                    },
                }
            }
        };
    }
} as Middleware<DBCore>;