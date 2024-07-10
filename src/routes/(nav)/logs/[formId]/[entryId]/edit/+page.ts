import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/db';
import { fromString } from 'typeid-unboxed';

export const load: PageLoad = async ({ params }) => {
    const form = await db.forms.get(fromString(params.formId, 'form'))
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