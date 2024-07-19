import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/db';
import { fromString } from 'typeid-unboxed';

export const load: PageLoad = async ({ params }) => {
    const log = await db.logs.get(fromString(params.logId, 'log'));
    const form = log ? await db.forms.get(log?.currentFormId) : undefined;
    const entry = await db.entries.get(fromString(params.entryId, 'entry'))
    if (form && entry) {
        return {
            form,
            entry,
        }
    }
    else {
        error(404, 'Not found');
    }
};