<script lang="ts">
	import { get_messages } from '$lib/chats.remote';
	let { id } = $props();
	const id_der = $derived(id);
</script>

<div class="wrapper">
	<ol class="feed">
		{#each await get_messages(id_der) as message, i (message.id)}
			<li class="msg" class:latest={i === 0}>
				<span class="node" aria-hidden="true"></span>
				<div class="body">
					{#if i === 0}
						<span class="tag">live</span>
					{/if}
					<p>{message.message}</p>
				</div>
			</li>
		{:else}
			<li class="empty">
				<span class="empty-mark" aria-hidden="true">/</span>
				<p>No transmissions yet. Say the first thing.</p>
			</li>
		{/each}
	</ol>
	<div
		{@attach (node) => {
			node.scrollIntoView({ behavior: 'smooth' });
		}}
		id="anchor"
	></div>
</div>

<style>
	.wrapper {
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 0.5rem;
		background: var(--paper);
		overscroll-behavior: contain;
		* {
			overflow-anchor: none;
		}
		#anchor {
			overflow-anchor: auto;
			height: 1px;
		}
	}

	.feed {
		position: relative;
		margin: 0;
		padding: 0;
		list-style: none;
		max-width: 68ch;
		display: flex;
		flex-direction: column-reverse;
	}

	/* the thread spine */
	.feed::before {
		content: '';
		position: absolute;
		left: 6px;
		top: 0.9rem;
		bottom: 0.9rem;
		width: 2px;
		background: linear-gradient(var(--line-strong), var(--line));
		border-radius: 2px;
	}

	.msg {
		position: relative;
		display: grid;
		grid-template-columns: 14px 1fr;
		column-gap: 1.1rem;
		align-items: start;
		padding-block: 0.32rem;
	}

	.node {
		position: relative;
		z-index: 1;
		width: 13px;
		height: 13px;
		margin-top: 0.4rem;
		border-radius: 50%;
		background: var(--paper);
		border: 2px solid var(--line-strong);
		transition: border-color 0.2s var(--ease-out);
	}

	.body {
		min-width: 0;
		margin-left: -0.55rem;
		padding: 0.34rem 0.65rem;
		border-radius: 11px;
		transition: background-color 0.22s var(--ease-out);
	}

	.body p {
		margin: 0;
		font-size: 1.06rem;
		line-height: 1.5;
		color: var(--ink);
		overflow-wrap: anywhere;
	}

	.msg:hover .body {
		background: var(--paper-sunken);
	}
	.msg:hover .node {
		border-color: var(--ink-faint);
	}

	/* latest transmission carries the accent */
	.latest .node {
		background: var(--accent);
		border-color: var(--accent);
		box-shadow: 0 0 0 4px var(--accent-glow);
		animation: pulse 2.4s var(--ease-out) infinite;
	}
	.latest .body {
		background: var(--accent-tint);
	}
	.latest:hover .body {
		background: var(--accent-tint);
	}

	.tag {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		margin-bottom: 0.15rem;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent-deep);
	}
	.tag::before {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
		animation: pulse 2.4s var(--ease-out) infinite;
	}

	.empty {
		display: grid;
		grid-template-columns: 14px 1fr;
		column-gap: 1.1rem;
		align-items: center;
		padding-block: 0.32rem;
	}
	.empty-mark {
		justify-self: center;
		font-family: var(--font-display);
		font-style: italic;
		font-size: 1.2rem;
		color: var(--ink-faint);
	}
	.empty p {
		margin: 0;
		color: var(--ink-faint);
		font-style: italic;
		font-family: var(--font-display);
		font-size: 1.1rem;
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 4px var(--accent-glow);
		}
		50% {
			box-shadow: 0 0 0 7px transparent;
		}
	}
</style>
