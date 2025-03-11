import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db, User, Package, Transaction } from '@database';

export async function POST(req: Request): Promise<NextResponse> {
    type bodyType = {
        order_id: string;
        transaction_id: string;
        transaction_time: string;
        transaction_status: string;
        fraud_status: 'accept' | 'deny';
    };

    const { order_id, transaction_id, transaction_time, transaction_status, fraud_status }: bodyType = await req.json();

    if (fraud_status === 'accept') {
        if (transaction_status === 'capture' || transaction_status === 'settlement') {
            await db.transaction(async (tx) => {
                const { userId, packageId }: { userId: number, packageId: number } = await tx.update(Transaction)
                    .set({ transaction_id, status: 'success', transaction_time: new Date(transaction_time) })
                    .where(eq(Transaction.order_id, order_id))
                    .returning({ userId: Transaction.user_id, packageId: Transaction.package_id })
                    .then((result) => result[0]);

                const { coin }: { coin: number } = await tx.select({ coin: Package.coin })
                    .from(Package)
                    .where(eq(Package.id, packageId))
                    .then((result) => result[0]);

                await tx.update(User)
                    .set({ coin: sql`${User.coin} + ${coin}` })
                    .where(eq(User.id, userId));
            });

            return NextResponse.json({ message: 'Purchase successful' }, { status: 200 });
        } else if (transaction_status === 'pending') {
            await db.update(Transaction)
                .set({ transaction_id, status: 'pending', transaction_time: new Date(transaction_time) })
                .where(eq(Transaction.order_id, order_id));

            return NextResponse.json({ message: 'Pending payment' }, { status: 200 });
        }
    }

    await db.update(Transaction)
        .set({ transaction_id, status: 'failed', transaction_time: new Date(transaction_time) })
        .where(eq(Transaction.order_id, order_id));

    return NextResponse.json({ message: 'Purchase failed' }, { status: 200 });
}
