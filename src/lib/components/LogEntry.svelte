<script lang="ts">
	import type { EntryRaw, ThingRaw } from "$lib/db";
	import db from "$lib/db";
	import { svelteTime } from "svelte-time";
	import { getType } from "typeid-unboxed";

    export let entry: EntryRaw;
    export let thing: ThingRaw | undefined = undefined;

    async function getThing() {
        return thing ?? await db.things.where('id').equals(entry.thingId).first();
    }

    const now = new Date().getTime();

    function useRelativeTime(date: Date) {
        //Use relative time if within last two days
        return date.getTime() > now - 2 * 24 * 60 * 60 * 1000;
    }

    let thingPromise = getThing();

</script>

<div>
    {#await thingPromise}
        <div aria-busy="true"></div>
    {:then thing}
    {#if thing}
        <h2>
            {thing.name}
            <a href={`/app/log/${entry.id}`} class="secondary">
                <time class="datetime" use:svelteTime={{
                    relative: useRelativeTime(entry.displayDatetime),
                    live: true,
                    timestamp: entry.displayDatetime,
                    format: "h:mm A · MMM D, YYYY",
                  }}>
                </time>
            </a>
        </h2>
        {#each thing.questions as question(question.id)}
        <h3>{question.text}</h3>
        {#if getType(question.id) == 'likert'}
            <p data-qtype='likert'>
                {entry.answers.get(question.id)} / 5
            </p>
        {:else if getType(question.id) == 'text'}
            <p data-qtype='text'>
                {#if entry.answers.get(question.id)}
                    {entry.answers.get(question.id)}
                {:else}
                    <span class="none">(Empty)</span>
                {/if}
            </p>
        {/if}
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
        font-weight: 600;
        margin-block: 0.5em;
    }
    h2 {
        font-size: 0.9em;
    }
    h3 {
        font-size: 0.85em;
    }
    time {
        float: right;
        font-weight: normal;
        font-size: 0.9em;
    }
    p {
        margin-bottom: 0;
    }
    p[data-qtype=likert] {
        font-weight: bold;
        font-size: 1.5em;
        line-height: 1;
    }
    .none {
        opacity: 0.75;
    }
</style>