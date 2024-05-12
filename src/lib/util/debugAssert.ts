import { dev } from "$app/environment";

export default function debugAssert(b: boolean, message: string): undefined {
    if (dev && !b) {
        console.log('Assertion failed! ' + message);
        throw new Error('Assertion failed! ' + message);
    }
    return undefined;
}