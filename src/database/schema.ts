/* eslint-disable @typescript-eslint/typedef */

import { pgTable, integer, pgEnum, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [ 'user', 'admin' ]);

export const User = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    clerk_id: varchar({ length: 50 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: userRoleEnum().notNull().default('user'),
    coin: integer().notNull().default(3),
    claim_free_coin: boolean().notNull().default(false),
    created_at: timestamp().notNull().defaultNow(),
    is_deleted: boolean().notNull().default(false),
    deleted_at: timestamp(),
});
