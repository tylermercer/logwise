import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/db';
import { fromString } from 'typeid-unboxed';

export const load: PageLoad = async ({ params }) => {
    const template = await db.templates.get(fromString(params.thingId, 'thing'))
    if (template) {
        return {
            template
        }
    }
    else {
        error(404, 'Not found');
    }
};