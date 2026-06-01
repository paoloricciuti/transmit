<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { check_login_user, login_with_github } from '$lib/auth.remote';

	const oauth_failed = $derived(page.url.searchParams.get('error') === 'github');
	await check_login_user();
</script>

<main>
	<a class="brand" href={resolve('/')}>
		<span class="logo" aria-hidden="true"></span>
		<span class="wordmark">transmit</span>
	</a>

	<section class="card">
		<p class="eyebrow"><span class="num">00</span> Sign in</p>
		<h1>Open the channel.</h1>
		<p class="lede">
			One identity so your messages stay yours across reloads, dropped connections, and devices.
		</p>

		<p class="signal" aria-hidden="true">
			<span>&middot;</span><span>&ndash;</span><span>&middot;</span><span>&middot;</span><span
				>&ndash;</span
			><span>&middot;</span><span>&ndash;</span><span>&ndash;</span>
		</p>

		{#if oauth_failed}
			<p class="alert" role="alert">
				GitHub didn&rsquo;t complete the handshake. Give it another try.
			</p>
		{/if}

		<form {...login_with_github}>
			<button class="gh" type="submit">
				<svg class="mark" viewBox="0 0 16 16" width="20" height="20" aria-hidden="true">
					<path
						fill="currentColor"
						d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
					/>
				</svg>
				<span class="gh-label">Continue with GitHub</span>
			</button>
		</form>

		<p class="fineprint">
			We read your public profile and email to identify you. Nothing is posted on your behalf.
		</p>
	</section>

	<footer>
		<span class="freq">144.800&nbsp;MHz</span>
		<span class="rule" aria-hidden="true"></span>
		<span>transmit</span>
	</footer>
</main>

<style>
	main {
		width: 100%;
		max-width: 28rem;
		min-height: 100dvh;
		margin-inline: auto;
		padding: clamp(1.5rem, 5vh, 3rem) clamp(1.25rem, 6vw, 2rem);
		display: grid;
		grid-template-rows: auto 1fr auto;
		gap: clamp(2rem, 7vh, 3.5rem);
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		justify-self: start;
		text-decoration: none;
		color: var(--ink);
	}
	.logo {
		width: 16px;
		height: 16px;
		background: var(--accent);
		border-radius: 4px;
		transform: rotate(45deg);
	}
	.wordmark {
		font-family: var(--font-display);
		font-optical-sizing: auto;
		font-weight: 520;
		font-size: 1.25rem;
		letter-spacing: 0.01em;
	}

	.card {
		align-self: center;
		display: flex;
		flex-direction: column;
	}

	.eyebrow {
		display: flex;
		align-items: baseline;
		gap: 0.55rem;
		margin: 0 0 1.1rem;
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--ink-soft);
	}
	.num {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: var(--accent-deep);
	}

	h1 {
		margin: 0;
		font-family: var(--font-display);
		font-optical-sizing: auto;
		font-weight: 560;
		font-size: clamp(2.4rem, 9vw, 3.1rem);
		line-height: 0.98;
		letter-spacing: -0.02em;
		color: var(--ink);
	}

	.lede {
		margin: 1rem 0 0;
		max-width: 34ch;
		font-size: 1.05rem;
		line-height: 1.55;
		color: var(--ink-soft);
	}

	.signal {
		display: flex;
		gap: 0.5rem;
		margin: 1.6rem 0 1.9rem;
		font-family: var(--font-mono);
		font-size: 0.9rem;
		color: var(--ink-faint);
		letter-spacing: 0.1em;
	}
	.signal span:nth-child(odd) {
		color: var(--accent);
	}

	.alert {
		margin: 0 0 1.1rem;
		padding: 0.7rem 0.9rem;
		border: 1px solid var(--accent);
		border-radius: 11px;
		background: var(--accent-tint);
		color: var(--accent-deep);
		font-size: 0.92rem;
		line-height: 1.45;
	}

	form {
		margin: 0;
	}

	.gh {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.65rem;
		width: 100%;
		padding: 0.95rem 1.4rem;
		border: 1px solid transparent;
		border-radius: 14px;
		background: var(--bar-bg);
		color: var(--bar-fg);
		font-family: var(--font-sans);
		font-size: 1.02rem;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 1px 2px var(--shadow-color);
		transition:
			transform 0.14s var(--ease-out),
			box-shadow 0.2s var(--ease-out),
			background-color 0.2s var(--ease-out);
	}
	.gh:hover {
		transform: translateY(-1px);
		box-shadow:
			0 6px 18px var(--shadow-color),
			0 0 0 4px var(--accent-glow);
	}
	.gh:active {
		transform: translateY(0);
	}
	.gh:focus-visible {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 4px var(--accent-glow);
	}
	.gh:disabled {
		cursor: progress;
		opacity: 0.82;
		transform: none;
		box-shadow: 0 1px 2px var(--shadow-color);
	}
	.mark {
		flex-shrink: 0;
	}

	.fineprint {
		margin: 1.1rem 0 0;
		max-width: 40ch;
		font-size: 0.82rem;
		line-height: 1.5;
		color: var(--ink-faint);
	}

	footer {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--ink-faint);
	}
	.freq {
		color: var(--ink-soft);
	}
	.rule {
		flex: 1;
		height: 1px;
		background: var(--line);
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.3;
			transform: translateY(0);
		}
		50% {
			opacity: 1;
			transform: translateY(-2px);
		}
	}
</style>
