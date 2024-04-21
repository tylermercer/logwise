<script lang="ts">
	import type { EntryRaw, ThingRaw } from "$lib/db";
	import db from "$lib/db";

    export let entry: EntryRaw;
    export let thing: ThingRaw | undefined = undefined;

    async function getThing() {
        return thing ?? await db.things.where('id').equals(entry.thingId).first();
    }

    let thingPromise = getThing();
</script>

<div>
    {#await thingPromise}
        <div aria-busy="true"></div>
    {:then thing}
    {#if thing}
        <h2>{thing.name}</h2>
        <p>{entry.displayDatetime.toLocaleString()}</p>
        {#each thing.questions as question(question.id)}
        <h3>{question.text}</h3>
        <p>{entry.answers.get(question.id)}</p>
        {/each}
    {:else}
        <!-- TODO: handle this?? -->
    {/if}
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
</div>
<style lang="scss">
    h2, h3 {
        font-size: 0.85em;
        font-weight: normal;
    }
</style>