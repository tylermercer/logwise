<script lang="ts">
    import { page } from "$app/stores";
</script>

<svelte:head>
	<title>{$page.error?.message ?? "An error occurred"}</title>
</svelte:head>

<main class="u-guttered">
    <h1>{$page.error?.message ?? "An error occurred"}</h1>
</main>