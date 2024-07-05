import { page } from '$app/stores';
import type { Page } from '@sveltejs/kit';

export default function ariaCurrent(el: HTMLAnchorElement) {

    const unsub = page.subscribe(((p: Page<Record<string, string>, string | null>) => {
        if (p.url.toString() === el.href) {
            el.setAttribute('aria-current', 'true');
        }
        else {
            el.removeAttribute('aria-current');
        }
    }));

    return {
        destroy: unsub
    }
}