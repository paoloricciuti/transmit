import { getRequestEvent, form, query } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { auth } from './server/auth';

/**
 * The signed-in user, guaranteed. If there's no session it redirects to
 * `/login` instead of returning, so any query, form or page that awaits it is
 * an auth gate: no logged-in user means the interaction never proceeds.
 * Queries are deduplicated, so the session lookup runs at most once per request.
 */
export const get_user = query(async () => {
	const { request } = getRequestEvent();
	const result = await auth.api.getSession({ headers: request.headers });
	if (!result?.user) redirect(303, '/login');
	return {
		id: result.user.id,
		name: result.user.name,
		email: result.user.email,
		image: result.user.image ?? null
	};
});

export const check_login_user = query(async () => {
	const { request } = getRequestEvent();
	const result = await auth.api.getSession({ headers: request.headers });
	if (result?.user) redirect(303, '/');
});

/**
 * Kick off the GitHub OAuth dance. Better Auth hands back the provider URL and
 * sets the state cookie on this request; we 303 the browser over to GitHub.
 * Works with or without JS: the native form POST follows the redirect, and the
 * enhanced submit lets SvelteKit perform the cross-origin navigation.
 */
export const login_with_github = form(async () => {
	const { request } = getRequestEvent();

	const { url } = await auth.api.signInSocial({
		headers: request.headers,
		body: { provider: 'github', callbackURL: '/' }
	});

	if (!url) {
		// Should never happen for a redirect-based provider, but never strand
		// the user on a dead POST.
		redirect(303, '/login?error=github');
	}

	redirect(303, url);
});

/** Drop the session and return to the login screen. */
export const sign_out = form(async () => {
	const { request } = getRequestEvent();
	await auth.api.signOut({ headers: request.headers });
	redirect(303, '/login');
});
