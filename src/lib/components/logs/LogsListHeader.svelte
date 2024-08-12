<script lang="ts">
	import Tooltip from "../util/Tooltip.svelte";
	import Plus from 'virtual:icons/teenyicons/add-small-outline';
</script>

<p class="heading l-row h4">
    <span class="h4">Logs</span>
    <Tooltip text="Add new log">
        <a
            href="/app/logs/new"
            class="btn-icon add-new-button"
            role="button"
            aria-label="Add new log"
        >
            <Plus />
        </a>
    </Tooltip>
</p>

<style lang="scss">
	.heading {
		align-items: center;
		justify-content: space-between;
		position: sticky;
		top: 0;
		background-color: var(--u-cascading-bg, var(--primary-1));
		padding-left: var(--space-m);
		padding-right: var(--space-m);
	}
	.add-new-button {
		margin-right: calc(var(--space-xs) * -1);
	}
</style>