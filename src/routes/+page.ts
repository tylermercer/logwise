import type { PageLoad } from './$types';

import { browser, building, dev } from '$app/environment';
import { error } from '@sveltejs/kit';

export const ssr = true;
export const prerender = true;

export const load: PageLoad = async () => {
    if (building || (dev && !browser)) {
        //Just show the loading state
        return {
            shouldRenderShell: true
        }
    }
    else if (browser) {
        //TODO: load root page data from Dexie
        return { 
            shouldRenderShell: false
        }
    }
    else {
        console.error("Root path loader was run on the server and not at build time")
        error(500);
    }
};