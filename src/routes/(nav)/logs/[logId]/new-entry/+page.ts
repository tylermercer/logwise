import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/db';
import { fromString } from 'typeid-unboxed';
import { DB_TRUE } from '$lib/db/types';

export const load: PageLoad = async ({ params }) => {
    const log = await db.logs.get(fromString(params.logId, 'log'));
    const form = log ? await db.forms.get(log?.currentFormId) : undefined;
    if (log && form && log.isArchived !== DB_TRUE) {
        return {
            log,
            form,
        }
    }
    else {
        error(404, 'Not found');
    }
};