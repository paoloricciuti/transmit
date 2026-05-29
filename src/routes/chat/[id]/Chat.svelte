<script lang="ts">
	import { get_messages } from '$lib/chats.remote';
	let { id, user_id } = $props();

	const id_der = $derived(id);

	$effect(() => {
		const event_source = new EventSource(`/chat/${id_der}/sse`);

		event_source.addEventListener('message', ({ data }) => {
			if (data.user_id === user_id) {
				return;
			}
			get_messages(id).refresh();
		});

		return () => {
			event_source.close();
		};
	});
</script>

<div class="wrapper">
	{#each await get_messages(id) as message (message.id)}
		<p>{message.message}</p>
	{/each}
</div>

<style>
	p {
		outline: 1px solid #777;
		padding: 0.5rem;
	}
	.wrapper {
		padding: 0.5rem;
		height: 100%;
		overflow: auto;
	}
</style>
