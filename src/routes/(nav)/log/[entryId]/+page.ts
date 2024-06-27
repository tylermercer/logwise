import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/db';
import { fromString } from 'typeid-unboxed';

export const load: PageLoad = async ({ params }) => {
    const existingEntry = await db.entries.get(fromString(params.entryId, 'entry'))
    if (existingEntry) {
        return {
            existingEntry
        }
    }
    else {
        error(404, 'Not found');
    }
};