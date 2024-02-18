<script lang="ts">
    import { todosStore, addTodo } from "$lib/todos";
	import type { NonEmptyString1000 } from "@evolu/common";

    $: count = $todosStore.length;
    $: console.log($todosStore);
    let value = 'Debug Evolu' as NonEmptyString1000;
    async function onClick() {
        console.log("clicked");
        await addTodo(value);
        console.log("added");
    }
</script>

<h1>Log Thing</h1>
<p>{count} To-Dos</p>
<input bind:value={value}> <button on:click={onClick}>Add</button>
