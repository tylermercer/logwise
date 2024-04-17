import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const ssr = true;

export const load: PageServerLoad = async ({ platform }) => {
  
    const { results } = await platform!.env.DB.prepare(
        "SELECT author, body FROM comments"
      )
      .all();

    return {
        comments: results.map(r => ({
            author: r['Author'] as string,
            body: r['Body'] as string,
        }))
    }
};

export const actions = {
	default: async ({ platform, request }) => {
		const data = await request.formData();
		const author = data.get('author') as string;
		const body = data.get('body') as string;
        if (!author.trim()) return fail(400, { author, missing: true });
        if (!body.trim()) return fail(400, { body, missing: true });
        
        const { success } = await platform!.env.DB.prepare(`
            insert into comments (author, body) values (?, ?)
        `).bind(author, body).run()
        
        if (success) {
            return { success: true }
        } else {
            return fail(500, { message: "Something went wrong" })
        }
	},
} satisfies Actions;