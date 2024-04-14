import type { PageServerLoad } from './$types';

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