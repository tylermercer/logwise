import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/db';
import { fromString } from 'typeid-unboxed';

export const load: PageLoad = async ({ params }) => {
    const existingTemplate = await db.templates.get(fromString(params.templateId, 'template'))
    if (existingTemplate) {
        return {
            existingTemplate
        }
    }
    else {
        error(404, 'Not found');
    }
};