<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { send_message } from '$lib/chats.remote.js';
	import { get_user, sign_out } from '$lib/auth.remote';
	import Chat from './Chat.svelte';

	let { params } = $props();
	const user = $derived(await get_user());
</script>

<main>
	<header class="topbar">
		<div class="brand">
			<span class="logo" aria-hidden="true"></span>

			<a href={resolve('/')}>
				<span class="wordmark">transmit</span>
			</a>
		</div>
		<div class="right">
			<div class="channel">
				<span class="chan-id">#{params.id.slice(0, 8)}</span>
			</div>
			<span class="me">
				{#if user.image}
					<img class="me-avatar" src={user.image} alt="" width="22" height="22" />
				{:else}
					<span class="me-avatar me-fallback" aria-hidden="true">{user.name.slice(0, 1)}</span>
				{/if}
				<form {...sign_out}>
					<button class="signout" type="submit" title="Sign out" aria-label="Sign out">
						<svg
							viewBox="0 0 24 24"
							width="16"
							height="16"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
							<polyline points="16 17 21 12 16 7" />
							<line x1="21" y1="12" x2="9" y2="12" />
						</svg>
					</button>
				</form>
			</span>
		</div>
	</header>

	<div class="feed-region">
		{#if browser}
			<Chat id={params.id} />
		{:else}
			<iframe
				name="chat"
				src={resolve('/chat/[id]/iframe#anchor', { id: params.id })}
				title="Chat iframe"
			></iframe>
		{/if}
	</div>

	<form class="composer" {...send_message} target={browser ? undefined : 'chat'}>
		<input {...send_message.fields.js_enabled.as('hidden', browser)} />
		<input
			class="composer-input"
			placeholder="Write a message"
			autocomplete="off"
			{...send_message.fields.message.as('text')}
		/>
		<button class="composer-reset" type="reset" title="Clear" aria-label="Clear message">
			<svg
				viewBox="0 0 24 24"
				width="16"
				height="16"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>
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
		max-width: 620px;
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
	.right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.me {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding-left: 1rem;
		border-left: 1px solid var(--bar-muted);
	}
	.me-avatar {
		flex-shrink: 0;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		object-fit: cover;
	}
	.me-fallback {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		color: var(--bar-fg);
		background: var(--accent);
	}
	.me form {
		display: flex;
		margin: 0;
	}
	.signout {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.3rem;
		border: none;
		border-radius: 8px;
		background: transparent;
		color: var(--bar-muted);
		cursor: pointer;
		transition:
			color 0.18s var(--ease-out),
			background-color 0.18s var(--ease-out);
	}
	.signout:hover {
		color: var(--accent);
		background: oklch(1 0 0 / 0.06);
	}
	.signout:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
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
		grid-template-columns: 1fr auto auto;
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
	.composer-reset {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border: none;
		background: transparent;
		color: var(--ink-faint);
		cursor: pointer;
		transition: color 0.18s var(--ease-out);
	}
	.composer-reset:hover {
		color: var(--ink);
	}
	.composer-reset:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
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

	@media (max-width: 540px) {
		.composer-send {
			padding: 0.7rem 1.05rem;
		}
		.wordmark {
			font-size: 1.1rem;
		}
		.me {
			padding-left: 0.85rem;
		}
	}
</style>
