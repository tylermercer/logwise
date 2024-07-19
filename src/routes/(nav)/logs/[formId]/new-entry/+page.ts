import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/db';
import { fromString } from 'typeid-unboxed';

export const load: PageLoad = async ({ params }) => {
    const form = await db.forms.get(fromString(params.formId, 'form'));
    const log = form ? await db.logs.get(form?.logId) : undefined;
    if (log && form) {
        return {
            log,
            form,
        }
    }
    else {
        error(404, 'Not found');
    }
};