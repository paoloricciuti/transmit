import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const chats = sqliteTable('chats', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull()
});

export const messages = sqliteTable('messages', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	chat_id: text('chat_id')
		.notNull()
		.references(() => chats.id, { onDelete: 'cascade' }),
	message: text('message').notNull(),
	created_at: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.$defaultFn(() => new Date())
});
