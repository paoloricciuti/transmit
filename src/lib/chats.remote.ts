import { resolve } from '$app/paths';
import { form, query } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import * as v from 'valibot';
import { db } from './server/db';
import { chats, messages } from './server/db/schema';

export const get_chats = query(() => {
	return db.select().from(chats).all();
});

export const create_chat = form(
	v.object({
		name: v.string()
	}),
	async ({ name }) => {
		console.log('lskjs');
		const chat = await db.insert(chats).values({ title: name }).returning().get();
		redirect(303, resolve('/chat/[id]', { id: chat.id }));
	}
);

let { promise, resolve: promise_resolve } = Promise.withResolvers<void>();

export const get_messages = query.live(v.string(), async function* (id) {
	while (true) {
		// refetch everytime just to make sure...we could resolve the message and just append that tho
		const msgs = await db
			.select()
			.from(messages)
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
		user_id: v.string(),
		js_enabled: v.boolean()
	}),
	async ({ chat_id, message, js_enabled }) => {
		await db.insert(messages).values({ chat_id, message });
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
