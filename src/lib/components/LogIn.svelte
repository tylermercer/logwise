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
</script>

{#if $ui}
	<dialog open>
		<h2>Log in to Log Thing</h2>
		<h3>{$ui.title}</h3>
		{#each $ui.alerts as alert, i}
			<p class={`dxcdlg-alert-${alert.type}`}>{resolveText(alert)}</p>
		{/each}
		<form on:submit={(e) => handleSubmit(e, $ui)}>
			{#each entries as e, idx}
				<label>
					{e.label ? `${e.label}: ` : e.fieldName}
					<input
                        class="dlg-input"
						type={e.type}
						name={e.fieldName}
						placeholder={e.placeholder}
						value={(params[e.fieldName] ?? '')}
						on:input={(ev) => updateField(ev, e.fieldName)}
					/>
				</label>
			{/each}
            <div class="l-cluster-l">
                <button type="submit">
                    {$ui.submitLabel}
                </button>
                {#if $ui.cancelLabel}
                    <button on:click={$ui.onCancel}>{$ui.cancelLabel}</button>
                {/if}
            </div>
		</form>
	</dialog>
{/if}

<style>
	dialog::backdrop {
		opacity: 0.5;
		background-color: #000;
		z-index: 150;
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
	}
	dialog {
		position: relative;
		color: #222;
		background-color: #fff;
		padding: 30px;
		margin-bottom: 2em;
		max-width: 90%;
		max-height: 90%;
		overflow-y: auto;
		border: 3px solid #3d3d5d;
		border-radius: 8px;
		box-shadow: 0 0 80px 10px #666;
		width: auto;
		font-family: sans-serif;
	}
	.dlg-input {
		height: 35px;
		width: 17em;
		border-color: #ccf4;
		outline: none;
		font-size: 17pt;
		padding: 8px;
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
