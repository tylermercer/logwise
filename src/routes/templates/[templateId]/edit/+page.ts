import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/db';
import { TypeID } from 'typeid-js';

export const load: PageLoad = async ({ params }) => {
    const existingTemplate = await db.templates.get(TypeID.fromString(params.templateId).asType('template'))
    if (existingTemplate) {
        return {
            existingTemplate
        }
    }
    else {
        error(404, 'Not found');
    }
};