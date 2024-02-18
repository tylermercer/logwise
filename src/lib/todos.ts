import { readable } from 'svelte/store';
import evolu from '$lib/evolu';
import type { ExtractRow, NonEmptyString1000 } from '@evolu/common';

const allTodos = evolu.createQuery((db) => db.selectFrom("todo").selectAll());

type Todo = ExtractRow<typeof allTodos>;

export const todosStore = readable([] as readonly Todo[], function start(set) {
    const unsub = evolu.subscribeQuery(allTodos)(() => {
        const { rows } = evolu.getQuery(allTodos);
        console.log("got rows", rows);
        set(rows);
    });
    console.log("subbed");

    return () => {
        unsub();
        console.log("unsubbed");
    }
});

export async function addTodo(title: NonEmptyString1000) {
    console.log(evolu.create("todo", { title, isCompleted: false }));
}