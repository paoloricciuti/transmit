import { resolve } from '$app/paths';
import { form, query } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import * as v from 'valibot';
import { get_user } from './auth.remote';
import { db } from './server/db';
import { chats, messages, user } from './server/db/schema';

export const get_chats = query(async () => {
	await get_user();
	return db.select().from(chats).all();
});

export const create_chat = form(
	v.object({
		name: v.string()
	}),
	async ({ name }) => {
		await get_user();
		const chat = await db.insert(chats).values({ title: name }).returning().get();
		redirect(303, resolve('/chat/[id]', { id: chat.id }));
	}
);

let { promise, resolve: promise_resolve } = Promise.withResolvers<void>();

export const get_messages = query.live(v.string(), async function* (id) {
	await get_user();
	while (true) {
		// refetch everytime just to make sure...we could resolve the message and just append that tho
		const msgs = await db
			.select({
				id: messages.id,
				message: messages.message,
				created_at: messages.created_at,
				author_id: messages.user_id,
				author_name: user.name,
				author_image: user.image
			})
			.from(messages)
			.innerJoin(user, eq(messages.user_id, user.id))
			.where(eq(messages.chat_id, id))
			.orderBy(desc(messages.created_at))
			.all();
		yield msgs;
		await promise;
	}
});

export const send_message = form(
	v.object({
		chat_id: v.string(),
		message: v.string(),
		js_enabled: v.boolean()
	}),
	async ({ chat_id, message, js_enabled }) => {
		const me = await get_user();
		await db.insert(messages).values({ chat_id, message, user_id: me.id });
		promise_resolve();
		({ promise, resolve: promise_resolve } = Promise.withResolvers<void>());
		if (!js_enabled) {
			redirect(
				303,
				resolve(`/chat/[id]/iframe?random=${Math.random()}#anchor`, {
					id: chat_id
				})
			);
		}
	}
);
