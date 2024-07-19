import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/db';
import { fromString } from 'typeid-unboxed';

export const load: PageLoad = async ({ params }) => {
    const formId = fromString(params.formId, 'form');
    const existingForm = await db.forms.get(formId);
    const existingLog = existingForm?.logId ? await db.logs.get(existingForm?.logId) : undefined;
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