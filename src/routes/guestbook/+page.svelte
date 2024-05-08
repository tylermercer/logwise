<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	export let data: PageData;
	export let form: ActionData;
</script>
<svelte:head>
    <title>Guestbook</title>
</svelte:head>
<main class="u-guttered">
    <h1>Guestbook</h1>
    {#each data.comments as { author, body }}
    <blockquote>
        <p>
            {body}
        </p>
        <cite>{author}</cite>
    </blockquote>
    {/each}
	{#if form?.error}
		<p class="u-error">{form.message}</p>
	{/if}
	{#if form?.success}
		<p class="u-success">Comment submitted</p>
	{/if}
    <form method="POST" use:enhance>
        <label>
            Comment
            <textarea name="body" required></textarea>
        </label>
        <label>
            Name
            <input type="text" name="author" required>
        </label>
        <button type="submit">Add Comment</button>
    </form>
</main>

<style lang="scss">
    cite {
        font-size: 0.7em;
        margin-block: 0;
    }
</style>