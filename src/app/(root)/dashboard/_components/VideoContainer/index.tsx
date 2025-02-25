import { JSX } from 'react';
import { ClerkMiddlewareAuthObject, auth } from '@clerk/nextjs/server';
import { db, User, Video } from '@database';
import { sql, eq } from 'drizzle-orm';
import VideoGallery from '../VideoGallery';

export default async function VideoContainer(): Promise<JSX.Element> {
    const { userId }: ClerkMiddlewareAuthObject = await auth();

    const [ { count } ]: { count: number }[] = await db.select({ count: sql<number>`COUNT(*)` })
        .from(Video)
        .innerJoin(User, eq(User.id, Video.user_id))
        .where(eq(User.clerk_id, userId!));

    return (
        <VideoGallery count={count} />
    );
}
