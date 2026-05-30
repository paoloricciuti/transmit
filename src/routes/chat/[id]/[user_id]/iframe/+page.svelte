<script lang="ts">
	import Chat from '../../Chat.svelte';
	let { params } = $props();
</script>

<svelte:head>
	<meta
		http-equiv="refresh"
		content="5; url=/chat/{params.id}/{params.user_id}/iframe?rand={Math.random()}#anchor"
	/>
</svelte:head>

<main>
	<Chat id={params.id} user_id={params.user_id} />
</main>

<style>
	main {
		width: 100vw;
		height: 100dvh;
		overflow: hidden;
		background: var(--paper);
	}
</style>
