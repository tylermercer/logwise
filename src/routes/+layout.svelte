<script lang="ts">
	import LogIn from '$lib/components/LogIn.svelte';
	import '@fontsource-variable/figtree';
	import '@fontsource-variable/rubik';
	import "modern-normalize/modern-normalize.css";
	import '../styles/base.scss';
	import '../styles/layouts.scss';
	import '../styles/theme.scss';
	import '../styles/utilities.scss';
</script>

<svelte:head>
	<title>Logwise</title>
</svelte:head>
<slot />
<LogIn/>
