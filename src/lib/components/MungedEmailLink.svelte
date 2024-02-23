<script lang="ts">
	let className: string = '';
	export { className as class };

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
	class="{className}"
	target="_blank"
>
	<slot></slot>
</a>
