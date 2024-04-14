<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
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
</main>

<style lang="scss">
    cite {
        font-size: 0.7em;
        margin-block: 0;
    }
</style>