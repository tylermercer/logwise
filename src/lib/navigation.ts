import { goto as gotoBase } from '$app/navigation';
import { base } from '$app/paths';

export const goto = (path: string) => gotoBase(`${base}${path}`);
