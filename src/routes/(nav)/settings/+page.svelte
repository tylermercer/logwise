<script lang="ts">
	import { onMount } from "svelte";

	let selected = localStorage.getItem(window.LOCAL_STORAGE_KEY_THEME) ?? window.THEME_VALUE_AUTO;

	const handleChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		if (target.checked) {
			if (target.value == window.THEME_VALUE_AUTO) {
				localStorage.removeItem(window.LOCAL_STORAGE_KEY_THEME);
			} else {
				localStorage.setItem(window.LOCAL_STORAGE_KEY_THEME, target.value);
			}
		}
		selected = target.value;
		window.setThemeFromLocalStorageOrMediaPreference();
	};


	onMount(() => {
		const handleStorage = (e: StorageEvent) => {
            if (e.key == window.LOCAL_STORAGE_KEY_THEME) {
				selected = e.newValue ?? window.THEME_VALUE_AUTO;
            }
        };
		
		window.addEventListener("storage", handleStorage);

		return {
			destroy() {
				window.removeEventListener("storage", handleStorage);
			}
		}
	});
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>
<header class="u-guttered">
	<h1>Settings</h1>
</header>
<main class="u-guttered l-prose">
	<h2>Appearance</h2>
	<fieldset>
		<legend>Theme</legend>
		<label>
			<input
				type="radio"
				name="auto"
				value={window.THEME_VALUE_AUTO}
				checked={selected === window.THEME_VALUE_AUTO}
				on:change={handleChange}
			/>
			Match System
		</label>
		<label>
			<input
				type="radio"
				name="light"
				value={window.THEME_VALUE_LIGHT}
				checked={selected === window.THEME_VALUE_LIGHT}
				on:change={handleChange}
			/>
			Light
		</label>
		<label>
			<input
				type="radio"
				name="dark"
				value={window.THEME_VALUE_DARK}
				checked={selected === window.THEME_VALUE_DARK}
				on:change={handleChange}
			/>
			Dark
		</label>
	</fieldset>
</main>	
