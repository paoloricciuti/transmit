<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { send_message } from '$lib/chats.remote.js';
	import Chat from './Chat.svelte';

	let { params } = $props();
	const user_id = crypto.randomUUID();
</script>

<main>
	<header class="topbar">
		<div class="brand">
			<span class="logo" aria-hidden="true"></span>

			<a href={resolve('/')}>
				<span class="wordmark">transmit</span>
			</a>
		</div>
		<div class="channel">
			<span class="status">live</span>
			<span class="chan-id">#{params.id.slice(0, 8)}</span>
		</div>
	</header>

	<div class="feed-region">
		{#if browser}
			<Chat id={params.id} {user_id} />
		{:else}
			<iframe name="chat" src="/chat/{params.id}/{user_id}/iframe#anchor" title="Chat iframe"
			></iframe>
		{/if}
	</div>

	<form class="composer" {...send_message} target={browser ? undefined : 'chat'}>
		<input {...send_message.fields.js_enabled.as('hidden', browser)} />
		<input {...send_message.fields.user_id.as('hidden', user_id)} />
		<input
			class="composer-input"
			placeholder="Write a message"
			autocomplete="off"
			{...send_message.fields.message.as('text')}
		/>
		<button class="composer-send" {...send_message.fields.chat_id.as('submit', params.id)}>
			Send
			<span class="arrow" aria-hidden="true">&rarr;</span>
		</button>
	</form>
</main>

<style>
	a {
		text-decoration: none;
		color: inherit;
	}
	main {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		gap: clamp(0.75rem, 2vw, 1.15rem);
		width: 100%;
		height: 100dvh;
		max-width: 940px;
		margin-inline: auto;
		padding: clamp(0.85rem, 2.5vw, 1.5rem);
		box-sizing: border-box;
		background: var(--paper);
	}

	/* header */
	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.8rem 1rem 0.8rem 1.15rem;
		background: var(--bar-bg);
		color: var(--bar-fg);
		border-radius: 16px;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}
	.logo {
		width: 15px;
		height: 15px;
		background: var(--accent);
		border-radius: 4px;
		transform: rotate(45deg);
	}
	.wordmark {
		font-family: var(--font-display);
		font-optical-sizing: auto;
		font-weight: 500;
		font-size: 1.2rem;
		letter-spacing: 0.01em;
		color: var(--bar-fg);
	}
	.channel {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
	}
	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-weight: 600;
		color: var(--bar-fg);
	}
	.status::before {
		content: '';
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 0 var(--accent-glow);
		animation: beacon 2.4s var(--ease-out) infinite;
	}
	.chan-id {
		color: var(--bar-muted);
		letter-spacing: 0.04em;
	}

	/* feed region: holds direct Chat (JS) or iframe (no-JS), identical box */
	.feed-region {
		min-height: 0;
		overflow: hidden;
		border-radius: 16px;
		background: var(--paper);
	}
	iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: none;
		background: var(--paper);
	}

	/* composer */
	.composer {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.4rem 0.4rem 1.2rem;
		background: var(--paper-raised);
		border: 1px solid var(--line);
		border-radius: 18px;
		box-shadow: 0 1px 2px var(--shadow-color);
		transition:
			border-color 0.2s var(--ease-out),
			box-shadow 0.2s var(--ease-out);
	}
	.composer:focus-within {
		border-color: var(--accent);
		box-shadow: 0 0 0 4px var(--accent-glow);
	}
	.composer-input {
		min-width: 0;
		border: none;
		background: transparent;
		font-family: var(--font-sans);
		font-size: 1.05rem;
		color: var(--ink);
		padding: 0.65rem 0;
		outline: none;
	}
	.composer-input::placeholder {
		color: var(--ink-faint);
	}
	.composer-send {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		border: none;
		background: var(--accent);
		color: var(--on-accent);
		font-family: var(--font-sans);
		font-size: 0.98rem;
		font-weight: 600;
		padding: 0.7rem 1.4rem;
		border-radius: 13px;
		cursor: pointer;
		transition:
			background-color 0.18s var(--ease-out),
			transform 0.12s var(--ease-out);
	}
	.composer-send:hover {
		background: var(--accent-deep);
	}
	.composer-send:active {
		transform: translateY(1px);
	}
	.composer-send:focus-visible {
		outline: 2px solid var(--ink);
		outline-offset: 2px;
	}
	.arrow {
		transition: transform 0.2s var(--ease-out);
	}
	.composer-send:hover .arrow {
		transform: translateX(3px);
	}

	@keyframes beacon {
		0%,
		100% {
			box-shadow: 0 0 0 0 var(--accent-glow);
		}
		50% {
			box-shadow: 0 0 0 5px transparent;
		}
	}

	@media (max-width: 540px) {
		.composer-send {
			padding: 0.7rem 1.05rem;
		}
		.wordmark {
			font-size: 1.1rem;
		}
	}
</style>
