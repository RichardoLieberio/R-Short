import { pgEnum, pgTable, integer, varchar, timestamp } from 'drizzle-orm/pg-core';

const userRoleEnum = pgEnum('user_role', [ 'user', 'admin' ]);
export const User = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    clerk_id: varchar({ length: 50 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: userRoleEnum().notNull().default('user'),
    coin: integer().notNull().default(2),
    created_at: timestamp().notNull().defaultNow(),
});

const videoStatusEnum = pgEnum('status', [ 'pending', 'created', 'failed' ]);
const videoDurationEnum = pgEnum('duration', [ '15', '30', '60' ]);
export const Video = pgTable('videos', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer().notNull().references(() => User.id),
    status: videoStatusEnum().notNull().default('pending'),
    style: varchar({ length: 30 }).notNull(),
    duration: videoDurationEnum().notNull(),
    storyboard: varchar().notNull(),
    path: varchar().unique(),
    created_at: timestamp().notNull().defaultNow(),
});
