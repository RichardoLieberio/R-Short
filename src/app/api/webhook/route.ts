import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { eq } from 'drizzle-orm';
import { db, logs, Log, User } from '@database';

export async function POST(req: Request): Promise<NextResponse> {
    const signingSecret: string = process.env.CLERK_SIGNING_SECRET!;
    const wh: Webhook = new Webhook(signingSecret);

    const headerPayload: Headers = await headers();
    const svix_id: string | null = headerPayload.get('svix-id');
    const svix_timestamp: string | null = headerPayload.get('svix-timestamp');
    const svix_signature: string | null = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) return NextResponse.json({
        message: 'Error: Missing Svix headers',
    }, { status: 400 });

    const payload: Promise<object> = await req.json();
    const body: string = JSON.stringify(payload);

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error: Could not verify webhook:', err);
        return NextResponse.json({
            message: 'Error: Verification error',
        }, { status: 400 });
    }

    const eventType: string = evt.type;

    if (eventType === 'user.created') {
        const { data }: { data: { id: string, external_accounts: { email_address: string }[] } } = JSON.parse(body);
        const email: string = data.external_accounts[0].email_address;

        try {
            await db.transaction(async (tx) => {
                await Promise.all([
                    tx.insert(User).values({ clerk_id: data.id, email }).onConflictDoUpdate({ target: User.email, set: { clerk_id: data.id, is_deleted: false, deleted_at: null } }),
                    tx.insert(Log).values({ email, action: 'user_created', message: logs['user_created']() }),
                ]);
            });

            return NextResponse.json({ message: logs['user_created']() }, { status: 200 });
        } catch (error) {
            console.error(error);
            await db.insert(Log).values({ email, action: 'error_creating_user', message: logs['error_creating_user']() });
            return NextResponse.json({ message: logs['error_creating_user']() }, { status: 503 });
        }
    } else if (eventType === 'user.deleted') {
        const { data }: { data: { id: string } } = JSON.parse(body);

        try {
            await db.transaction(async (tx) => {
                const [ result ]: { email: string }[] = await tx.update(User).set({ is_deleted: true, deleted_at: new Date() }).where(eq(User.clerk_id, data.id)).returning({ email: User.email });
                await tx.insert(Log).values({ email: result.email, action: 'user_deleted', message: logs['user_deleted']() });
            });

            return NextResponse.json({ message: logs['user_deleted']() }, { status: 200 });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: logs['error_deleting_user']() }, { status: 503 });
        }

    }

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}
