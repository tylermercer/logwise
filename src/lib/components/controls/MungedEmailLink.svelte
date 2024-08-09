<script lang="ts">
	import type { Snippet } from 'svelte';
	
	let { children }: {children: Snippet} = $props();

	function dec(str: string) {
        return str.replace(/[a-zA-Z]/g, function (c: any) {
            return String.fromCharCode(
                (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13)
                    ? c
                    : c - 26,
            );
        });
    }

	let mungedUser = 'ybtguvat.srrqonpx'; //logthing.feedback
	let mungedDomain = 'glyrezrepre.arg'; //tylermercer.net
</script>

<a
	href="mailto:{dec(`${mungedUser}@${mungedDomain}`)}"
	target="_blank"
>
	{@render children()}
</a>
