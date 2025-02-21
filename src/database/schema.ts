/* eslint-disable @typescript-eslint/typedef */

import { pgTable, integer, pgEnum, varchar, boolean, json, timestamp } from 'drizzle-orm/pg-core';

export const logs = {
    'user_created': (): string => `A new user was successfully created.`,
    'error_creating_user': (): string => `User creation failed.`,
    'user_deleted': (): string => `The user was successfully deleted.`,
    'error_deleting_user': (): string => `Failed to delete the user.`,
    'video_generated': (): string => `A video was generated successfully.`,
    'error_generating_video': (): string => `Video generation failed.`,
    'coin_bought': (coins: number, price: string ): string => `Purchase of ${coins} coins at ${price} completed.`,
    'error_buying_coin': (coins: number, price: string ): string => `Failed to purchase ${coins} coins at ${price}.`,
    'admin:user_role_changed': (user: string, role: string): string => `Role of ${user} was changed to ${role}.`,
    'admin:error_changing_user_role': (user: string, role: string): string => `Failed to change role of ${user} to ${role}.`,
    'admin:user_coin_changed': (user: string, coin: number): string => `Coin balance of ${user} was updated to ${coin}.`,
    'admin:error_changing_user_coin': (user: string, coin: number): string => `Failed to update coin balance of ${user} to ${coin}.`,
};

export const logActionEnum = pgEnum('action', Object.keys(logs) as [ string, ...string[] ]);
export const userRoleEnum = pgEnum('user_role', [ 'user', 'admin' ]);
export const videoStatusEnum = pgEnum('status', [ 'success', 'pending', 'failed' ]);
export const transactionTypeEnum = pgEnum('type', [ 'global', 'local' ]);

export const Log = pgTable('logs', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull(),
    action: logActionEnum().notNull(),
    message: varchar({ length: 255 }).notNull(),
    timestamp: timestamp().notNull().defaultNow(),
});

export const Package = pgTable('packages', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    coin: integer().notNull(),
    normal_price: integer().notNull(),
    final_price: integer().notNull(),
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

export const Transaction = pgTable('transactions', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer().notNull().references(() => User.id),
    package_id: integer().notNull().references(() => Package.id),
    type: transactionTypeEnum().notNull(),
    created_at: timestamp().notNull().defaultNow(),
});
