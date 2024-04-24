import { goto as gotoBase } from '$app/navigation';
import { base } from '$app/paths';

export const goto: typeof gotoBase = (path, options = {}) => gotoBase(`${base}${path}`, options);
