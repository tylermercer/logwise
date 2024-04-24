import { browser } from '$app/environment';
import db from '$lib/db';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async () => {
    if (browser) {
        await db.open();
    }
    return {
		db,
	};
};