import { browser } from '$app/environment';
import db from '$lib/db';
import logCommitHash from '$lib/util/logCommitHash';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async () => {
    if (browser) {
        await db.open();
        logCommitHash();
    }
    return {
		db,
	};
};