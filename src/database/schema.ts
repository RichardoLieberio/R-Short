/* eslint-disable @typescript-eslint/typedef */

import { integer, pgTable, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const User = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: text().notNull(),
    coin: integer().notNull().default(0),
    claim_free_coin: boolean().notNull().default(false),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
});
