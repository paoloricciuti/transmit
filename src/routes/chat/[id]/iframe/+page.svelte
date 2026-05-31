<script lang="ts">
	import { resolve } from '$app/paths';
	import Chat from '../Chat.svelte';
	let { params } = $props();
</script>

<svelte:head>
	<meta
		http-equiv="refresh"
		content="5; url={resolve('/chat/[id]/iframe?rand={Math.random()}#anchor', { id: params.id })}"
	/>
</svelte:head>

<main>
	<Chat id={params.id} />
</main>

<style>
	main {
		width: 100vw;
		height: 100dvh;
		overflow: hidden;
		background: var(--paper);
	}
</style>
