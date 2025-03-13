'use server';

import { db, User } from '@database';
import { userType } from './types';

export async function fetchUsers(): Promise<userType[]> {
    const users: userType[] = await db.select({ email: User.email, role: User.role, coin: User.coin, createdAt: User.created_at }).from(User);
    return users;
}
