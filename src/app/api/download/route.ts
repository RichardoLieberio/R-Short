import { auth, ClerkMiddlewareAuthObject } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db, User, Video } from '@database';

export async function GET(req: NextRequest): Promise<NextResponse> {
    const id: string | null = req.nextUrl.searchParams.get('id');

    if (id && !isNaN(Number(id))) {
        const { userId }: ClerkMiddlewareAuthObject = await auth();

        const path: string | undefined | null = await db.select({ path: Video.path })
            .from(Video)
            .innerJoin(User, eq(User.id, Video.user_id))
            .where(and(eq(Video.id, Number(id)), eq(User.clerk_id, userId!)))
            .then((result) => result[0]?.path);

        if (path) {
            const response: Response = await fetch(path);

            if (response.ok) {
                const headers: Headers = new Headers();
                headers.set('Content-Type', 'video/mp4');
                headers.set('Content-Disposition', `attachment; filename="video-${id}.mp4"`);

                const stream: ReadableStream<Uint8Array<ArrayBufferLike>> | null = response.body;
                return new NextResponse(stream, { status: 200, headers });
            }
        }
    }

    return new NextResponse(null, { status: 404 });
}
