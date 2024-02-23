import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db, { type TemplateId } from '$lib/db';

export const load: PageLoad = async ({ params }) => {
    const template = await db.templates.get(params.templateId as TemplateId)
    if (template) {
        return {
            template
        }
    }
    else {
        error(404, 'Not found');
    }
};