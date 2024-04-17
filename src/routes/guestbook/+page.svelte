<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	// export let form: ActionData;
</script>

<main class="container">
    <h1>Guestbook</h1>
    {#each data.comments as { author, body }}
    <blockquote>
        <p>
            {body}
        </p>
        <cite>{author}</cite>
    </blockquote>
    {/each}
    <form method="POST">
        <label>
            Author
            <input type="text" name="author" required>
        </label>

        <label>
            Comment
            <textarea name="body" required></textarea>
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