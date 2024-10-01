<script lang="ts">
	import db from '$lib/db';
	import showModal from '$lib/util/actions/showModal';
	import { resolveText, type DXCUserInteraction } from 'dexie-cloud-addon';

	type Params = { [param: string]: string };

	let params = {} as Params;
	let ui = db.cloud.userInteraction;

	function updateField(event: Event, fieldName: string) {
		params = { ...params, [fieldName]: (event.target as HTMLInputElement).value };
	}

	$: entries = Object.entries($ui?.fields ?? {}).map(([fieldName, data]) => {
		return {
			...(data as { type: string; placeholder: string; label: string }),
			fieldName: fieldName as string
		};
	});

	function handleSubmit(e: Event, ui: DXCUserInteraction) {
		e.preventDefault();
		ui.onSubmit(params);
	}
</script>

{#if $ui}
	<dialog use:showModal class="l-column l-space-s">
		<h2>Sign in to Logwise</h2>
		<p class="u-error">
			Login is disabled because Logwise has been <a
				href="https://tylermercer.net/posts/software/unlaunching">unlaunched</a
			>. (You can still use the full application without signing in&mdash;your data will be saved
			locally.)
		</p>
		<p>{$ui.title}</p>
		{#each $ui.alerts as alert, i}
			<p class={`u-${alert.type}`}>{resolveText(alert)}</p>
		{/each}
		<form on:submit={(e) => handleSubmit(e, $ui)} class="l-column">
			{#each entries as e}
				<label>
					{e.label ? `${e.label}` : e.fieldName}
					<input
						disabled
						class="dlg-input"
						type={e.type}
						name={e.fieldName}
						placeholder={e.placeholder}
						value={params[e.fieldName] ?? ''}
						on:input={(ev) => updateField(ev, e.fieldName)}
					/>
				</label>
			{/each}
			<div class="l-cluster-r l-space-xs">
				{#if $ui.cancelLabel}
					<button type="button" class="btn-secondary" on:click={$ui.onCancel}>
						{$ui.cancelLabel}
					</button>
				{/if}
				<button disabled type="submit">
					{$ui.submitLabel}
				</button>
			</div>
		</form>
	</dialog>
{/if}

<style>
	.dxcdlg-alert-warning {
		color: #f80;
		font-weight: bold;
	}
	.dxcdlg-alert-info {
		color: black;
	}
</style>
