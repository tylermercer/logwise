import { browser } from '$app/environment';
import logCommitHash from '$lib/util/logCommitHash';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async () => {
    if (browser) {
        logCommitHash();
    };
};