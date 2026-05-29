<script lang="ts">
	import { browser } from '$app/environment';
	import { send_message } from '$lib/chats.remote.js';
	import Chat from './Chat.svelte';

	let { params } = $props();
	const user_id = crypto.randomUUID();
</script>

<main>
	<div>
		{#if browser}
			<Chat id={params.id} {user_id} />
		{:else}
			<iframe name="chat" src="/chat/{params.id}/{user_id}/iframe" title="Chat iframe"></iframe>
		{/if}
	</div>

	<form {...send_message} target={browser ? undefined : 'chat'}>
		<input {...send_message.fields.js_enabled.as('hidden', browser)} />
		<input {...send_message.fields.user_id.as('hidden', user_id)} />
		<input {...send_message.fields.message.as('text')} />
		<button {...send_message.fields.chat_id.as('submit', params.id)}>Send</button>
	</form>
</main>

<style>
	main {
		display: grid;
		grid-template-rows: 1fr auto;
		gap: 1rem;
		width: 100vw;
		height: 100vh;
		padding: 1rem;
		box-sizing: border-box;
	}
	div {
		padding: 1rem;
		overflow: hidden;
	}
	iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
