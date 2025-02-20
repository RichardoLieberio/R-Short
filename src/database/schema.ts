/* eslint-disable @typescript-eslint/typedef */

import { pgTable, integer, pgEnum, varchar, boolean, json, timestamp } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [ 'user', 'admin' ]);
export const videoStatusEnum = pgEnum('status', [ 'success', 'pending', 'failed' ]);

export const Faq = pgTable('faqs', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    question: varchar({ length: 255 }).notNull(),
    answer: varchar({ length: 255 }).notNull(),
    position: integer().unique().notNull(),
    created_at: timestamp().notNull().defaultNow(),
});

export const User = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    clerk_id: varchar({ length: 50 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: userRoleEnum().notNull().default('user'),
    coin: integer().notNull().default(2),
    created_at: timestamp().notNull().defaultNow(),
    is_deleted: boolean().notNull().default(false),
    deleted_at: timestamp(),
});

export const Video = pgTable('videos', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer().notNull().references(() => User.id),
    audio_uri: json(),
    image_uri: json(),
    captions: json(),
    created_at: timestamp().notNull().defaultNow(),
});
