import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/db';
import { fromString } from 'typeid-unboxed';

export const load: PageLoad = async ({ params }) => {
    const entry = await db.entries.get(fromString(params.entryId, 'entry'));
    const log = await db.logs.get(fromString(params.logId, 'log'));
    const form = log ? await db.forms.get(log?.currentFormId) : undefined;
    if (entry && log && form) {
        return {
            entry,
            form,
            log,
        }
    }
    else {
        error(404, 'Not found');
    }
};