<script lang="ts">
	import db from '$lib/db';
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
	function showModal(e: HTMLDialogElement) {
		e.showModal();
	}
</script>

{#if $ui}
	<dialog use:showModal class="l-column l-space-s">
		<h2>Sign in to Logwise</h2>
		<p>{$ui.title}</p>
		{#each $ui.alerts as alert, i}
			<p class={`dxcdlg-alert-${alert.type}`}>{resolveText(alert)}</p>
		{/each}
		<form on:submit={(e) => handleSubmit(e, $ui)} class="l-column">
			{#each entries as e}
				<label>
					{e.label ? `${e.label}: ` : e.fieldName}
					<input
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
					<button class="btn-secondary" on:click={$ui.onCancel}>{$ui.cancelLabel}</button>
				{/if}
				<button type="submit">
					{$ui.submitLabel}
				</button>
			</div>
		</form>
	</dialog>
{/if}

<style>
	dialog::backdrop {
		opacity: 0.5;
		background-color: #000;
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
	}
	dialog {
		position: absolute;
		top: 20%;
		color: #222;
		background-color: #fff;
		padding: var(--space-s);
		max-width: 90%;
		max-height: 60%;
		overflow-y: auto;
		border: 3px solid var(--space-s);
		border-radius: var(--space-xs);
		width: auto;
		font-family: sans-serif;
	}
	.dxcdlg-alert-error {
		color: red;
		font-weight: bold;
	}
	.dxcdlg-alert-warning {
		color: #f80;
		font-weight: bold;
	}
	.dxcdlg-alert-info {
		color: black;
	}
</style>
