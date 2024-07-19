import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/db';
import { fromString } from 'typeid-unboxed';

export const load: PageLoad = async ({ params }) => {
    const existingLog = await db.logs.get(fromString(params.logId, 'log'));
    const existingForm = existingLog ? await db.forms.get(existingLog?.currentFormId) : undefined;
    if (existingForm && existingLog) {
        return {
            existingForm,
            existingLog
        }
    }
    else {
        error(404, 'Not found');
    }
};