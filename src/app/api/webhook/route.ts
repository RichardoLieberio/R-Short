import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { eq } from 'drizzle-orm';
import { db, User } from '@database';

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

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await db.insert(User)
            .values({ clerk_id: data.id, email: data.external_accounts[0].email_address })
            .onConflictDoUpdate({
                target: User.email,
                set: { clerk_id: data.id, is_deleted: false, deleted_at: null },
            });
    } else if (eventType === 'user.deleted') {
        const { data }: { data: { deleted: boolean, id: string } } = JSON.parse(body);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (data.deleted) await db.update(User).set({ is_deleted: true, deleted_at: new Date() }).where(eq(User.clerk_id, data.id));
    }

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}
