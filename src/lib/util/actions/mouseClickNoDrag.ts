import type { ActionReturn } from "svelte/action";

interface Attributes {
    'on:click-without-drag': (e: CustomEvent) => void;
}

export default function mouseClickNoDrag(element: HTMLElement): ActionReturn<undefined, Attributes> {
    let mouseDownPos: { x: number, y: number } | undefined;

    const handleMouseDown = (event: MouseEvent) => {
        mouseDownPos = { x: event.clientX, y: event.clientY };
    }
    
    const handleMouseUp = (event: MouseEvent) => {
        if (mouseDownPos && mouseDownPos.x === event.clientX && mouseDownPos.y === event.clientY) {
            element.dispatchEvent(new CustomEvent('click-without-drag'));
        }

        mouseDownPos = undefined;
    }

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);

    return {
        destroy() {
            element.removeEventListener('mousedown', handleMouseDown);
            element.removeEventListener('mouseup', handleMouseUp);
        }
    };
}