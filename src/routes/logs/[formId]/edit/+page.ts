import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/db';
import { fromString } from 'typeid-unboxed';

export const load: PageLoad = async ({ params }) => {
    const existingForm = await db.forms.get(fromString(params.formId, 'form'))
    if (existingForm) {
        return {
            existingForm
        }
    }
    else {
        error(404, 'Not found');
    }
};