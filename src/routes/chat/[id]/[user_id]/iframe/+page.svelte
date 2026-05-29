<script lang="ts">
	import Chat from '../../Chat.svelte';
	let { params } = $props();
</script>

<svelte:head>
	<meta http-equiv="refresh" content="5" />
</svelte:head>

<main>
	<Chat id={params.id} user_id={params.user_id} />
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
</style>
