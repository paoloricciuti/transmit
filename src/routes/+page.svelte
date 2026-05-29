<script lang="ts">
	import { resolve } from '$app/paths';
	import { create_chat, get_chats } from '$lib/chats.remote';
</script>

<h2>Create a chat</h2>

<form {...create_chat}>
	<label>
		Title:
		<input {...create_chat.fields.name.as('text')} />
		<button>Create</button>
	</label>
</form>

<h2>Or join an existing chat</h2>

{#each await get_chats() as chat (chat.id)}
	<a href={resolve('/chat/[id]', { id: chat.id })}>{chat.title}</a>
{/each}
