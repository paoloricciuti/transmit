import { form, query, requested } from '$app/server';
import { eq } from 'drizzle-orm';
import { db } from './server/db';
import { chats, messages } from './server/db/schema';
import * as v from 'valibot';
import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { controllers } from './controller';

const text_encoder = new TextEncoder();

export const get_chats = query(() => {
	return db.select().from(chats).all();
});

export const create_chat = form(
	v.object({
		name: v.string()
	}),
	async ({ name }) => {
		const chat = await db.insert(chats).values({ title: name }).returning().get();
		redirect(303, resolve('/chat/[id]', { id: chat.id }));
	}
);

export const get_messages = query(v.string(), async (id) => {
	const msgs = await db.select().from(messages).where(eq(messages.chat_id, id)).all();
	return msgs.reduce<typeof msgs>((acc, _msg, i, arr) => {
		acc.push(arr.at(arr.length - 1 - i)!);
		return acc;
	}, []);
});

export const send_message = form(
	v.object({
		chat_id: v.string(),
		message: v.string(),
		user_id: v.string(),
		js_enabled: v.boolean()
	}),
	async ({ chat_id, message, user_id, js_enabled }) => {
		await db.insert(messages).values({ chat_id, message });
		await requested(get_messages, 1).refreshAll();
		for (const controller of controllers.get(chat_id) ?? []) {
			controller.enqueue(text_encoder.encode(`data: ${JSON.stringify({ user_id })}\n\n`));
		}
		if (!js_enabled) {
			redirect(303, resolve('/chat/[id]/[user_id]/iframe', { id: chat_id, user_id }));
		}
	}
);
