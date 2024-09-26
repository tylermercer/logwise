<script lang="ts">
	import PlusIcon from 'virtual:icons/teenyicons/add-outline';
</script>

<div class="add-widget-container">
    <a role="button" class="add-widget u-nav-link l-row l-space-xs" href="/app/new-widget">
        <PlusIcon />
        Add Widget
    </a>
</div>

<style lang="scss">
	a.add-widget {
		padding-left: var(--space-xs);
		align-items: center;
	}
    
	.add-widget-container {
		padding-top: 0;
		padding-bottom: 0;
		&>:global(a) {
			margin-left: calc(-1 * var(--space-2xs));
			margin-right: calc(-1 * var(--space-2xs));
		}
	}
</style>
