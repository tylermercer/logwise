import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/db';
import { fromString } from 'typeid-unboxed';

export const load: PageLoad = async ({ params }) => {
    const existingThing = await db.things.get(fromString(params.thingId, 'thing'))
    if (existingThing) {
        return {
            existingThing
        }
    }
    else {
        error(404, 'Not found');
    }
};