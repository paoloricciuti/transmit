<script lang="ts">
	import { resolve } from '$app/paths';
	import { create_chat, get_chats } from '$lib/chats.remote';
	import { get_user, sign_out } from '$lib/auth.remote';

	const user = $derived(await get_user());
</script>

<main>
	<nav class="account">
		<span class="who">
			{#if user.image}
				<img src={user.image} alt="" width="22" height="22" />
			{/if}
			<span class="who-name">{user.name}</span>
		</span>
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
	</nav>

	<header class="masthead">
		<span class="logo" aria-hidden="true"></span>
		<h1>transmit</h1>
		<p class="lede">
			A progressively enhanced chat. It keeps talking with JavaScript switched off, the network
			crawling, or both at once.
		</p>
	</header>

	<section class="panel">
		<h2><span class="num">01</span> Start a channel</h2>
		<form class="create" {...create_chat}>
			<input
				class="create-input"
				placeholder="Name your channel"
				autocomplete="off"
				{...create_chat.fields.name.as('text')}
			/>
			<button class="create-btn">
				Create
				<span class="arrow" aria-hidden="true">&rarr;</span>
			</button>
		</form>
	</section>

	<section class="panel">
		<h2><span class="num">02</span> Or join one</h2>
		<ul class="channels">
			{#each await get_chats() as chat (chat.id)}
				<li>
					<a href={resolve('/chat/[id]', { id: chat.id })}>
						<span class="hash" aria-hidden="true">#</span>
						<span class="name">{chat.title}</span>
						<span class="go" aria-hidden="true">&rarr;</span>
					</a>
				</li>
			{:else}
				<li class="none">No open channels. Start the first one above.</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	main {
		width: 100%;
		max-width: 620px;
		margin-inline: auto;
		padding: clamp(2.5rem, 8vh, 5rem) clamp(1.25rem, 5vw, 2rem) 4rem;
		display: flex;
		flex-direction: column;
		gap: clamp(2rem, 5vh, 3rem);
	}

	.account {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		min-height: 1.75rem;
		margin-top: -0.5rem;
	}
	.who {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
	.who img {
		border-radius: 50%;
		object-fit: cover;
	}
	.who-name {
		font-weight: 500;
		color: var(--ink);
	}
	.account form {
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
		color: var(--ink-faint);
		cursor: pointer;
		transition:
			color 0.18s var(--ease-out),
			background-color 0.18s var(--ease-out);
	}
	.signout:hover {
		color: var(--accent);
		background: var(--paper-raised);
	}
	.signout:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.masthead {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.logo {
		width: 22px;
		height: 22px;
		background: var(--accent);
		border-radius: 6px;
		transform: rotate(45deg);
		margin-bottom: 0.8rem;
	}
	h1 {
		margin: 0;
		font-family: var(--font-display);
		font-optical-sizing: auto;
		font-weight: 540;
		font-size: clamp(2.8rem, 9vw, 4rem);
		line-height: 0.95;
		letter-spacing: -0.02em;
		color: var(--ink);
	}
	.lede {
		margin: 0;
		max-width: 46ch;
		font-size: 1.08rem;
		line-height: 1.55;
		color: var(--ink-soft);
	}

	.panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	h2 {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		margin: 0;
		font-size: 1.02rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--ink);
	}
	.num {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--accent-deep);
		letter-spacing: 0.1em;
	}

	.create {
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
	.create:focus-within {
		border-color: var(--accent);
		box-shadow: 0 0 0 4px var(--accent-glow);
	}
	.create-input {
		min-width: 0;
		border: none;
		background: transparent;
		font-family: var(--font-sans);
		font-size: 1.05rem;
		color: var(--ink);
		padding: 0.65rem 0;
		outline: none;
	}
	.create-input::placeholder {
		color: var(--ink-faint);
	}
	.create-btn {
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
	.create-btn:hover {
		background: var(--accent-deep);
	}
	.create-btn:active {
		transform: translateY(1px);
	}
	.create-btn:focus-visible {
		outline: 2px solid var(--ink);
		outline-offset: 2px;
	}
	.arrow {
		transition: transform 0.2s var(--ease-out);
	}
	.create-btn:hover .arrow {
		transform: translateX(3px);
	}

	.channels {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}
	.channels a {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.8rem;
		padding: 0.95rem 0.6rem;
		border-bottom: 1px solid var(--line);
		text-decoration: none;
		color: var(--ink);
		transition:
			background-color 0.18s var(--ease-out),
			padding-left 0.18s var(--ease-out);
	}
	.channels a:hover {
		background: var(--paper-raised);
		padding-left: 1rem;
	}
	.hash {
		font-family: var(--font-mono);
		color: var(--accent-deep);
		font-size: 0.95rem;
	}
	.name {
		font-size: 1.05rem;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.go {
		color: var(--ink-faint);
		transition:
			transform 0.18s var(--ease-out),
			color 0.18s var(--ease-out);
	}
	.channels a:hover .go {
		color: var(--accent);
		transform: translateX(3px);
	}
	.none {
		padding: 0.95rem 0.6rem;
		color: var(--ink-faint);
		font-style: italic;
		font-family: var(--font-display);
		border-bottom: 1px solid var(--line);
	}
</style>
