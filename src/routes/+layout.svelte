<script lang="ts">
	import MungedEmailLink from '$lib/components/MungedEmailLink.svelte';
	import '../styles/base.scss';
	import '../styles/layouts.scss';
	import '../styles/utilities.scss';
</script>

<slot />
<footer class="container">
	<small>
		Created by <a class="secondary" href="https://tylermercer.net">Tyler Mercer</a>. Got feedback? <MungedEmailLink class="secondary">Email me!</MungedEmailLink>
	</small>
</footer>
