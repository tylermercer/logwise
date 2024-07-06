import { get, writable } from 'svelte/store';
import {
	beforeNavigate,
} from '$app/navigation';

const hasBack = writable(false);

export const initBackButtonLinks = () => {
    beforeNavigate(n => hasBack.set(n.from?.route != null));
}

export default function backButtonLink(el: HTMLAnchorElement) {
    const handleClick = (e: Event) => {
        if (get(hasBack)) {
            history.back();
            e.preventDefault();
        }
    }

    el.addEventListener('click', handleClick);

    return {
        destroy: () => el.removeEventListener('click', handleClick)
    }
}