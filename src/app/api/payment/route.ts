import { NextResponse } from 'next/server';
import { auth, ClerkMiddlewareAuthObject } from '@clerk/nextjs/server';
import Midtrans from 'midtrans-client-typescript';
import { Snap } from 'midtrans-client-typescript/lib/snap';
import { eq } from 'drizzle-orm';
import { db, User, Package, Transaction } from '@database';

export async function POST(req: Request): Promise<NextResponse> {
    const { userId: clerkId }: ClerkMiddlewareAuthObject = await auth();
    if (!clerkId) return NextResponse.json({ message: 'You are not authenticated' }, { status: 401 });

    const { userId }: { userId?: number } = await db.select({ userId: User.id }).from(User).where(eq(User.clerk_id, clerkId)).then((result) => result[0] || {});
    if (!userId) return NextResponse.json({ message: 'You are not authenticated' }, { status: 401 });

    const { packageId }: { packageId: number | undefined } = await req.json() || {};
    if (!packageId) return NextResponse.json({ message: 'Package Id is required' }, { status: 429 });

    type pkgType = {
        id: number;
        coin: number;
        normalPrice: number;
        finalPrice: number;
    };

    const pkg: pkgType = await db.select({ id: Package.id, coin: Package.coin, normalPrice: Package.normal_price, finalPrice: Package.final_price })
        .from(Package)
        .where(eq(Package.id, packageId))
        .then((result) => result[0]);

    if (!pkg) return NextResponse.json({ message: 'Package not found' }, { status: 404 });

    const snap: Snap = new Midtrans.Snap({
        isProduction: process.env.MODE === 'production',
        clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    type parameterType = {
        transaction_details: {
            order_id: string,
            gross_amount: number,
        },
        item_details: {
            id: string,
            price: number,
            quantity: number,
            name: string,
            brand: string,
            merchant_name: string,
        }[],
        expiry: {
            unit: string,
            duration: number,
        },
        page_expiry: {
            unit: string,
            duration: number,
        },
    };

    const orderId: string = generateOrderId();
    const parameter: parameterType = {
        transaction_details: {
            order_id: orderId,
            gross_amount: pkg.finalPrice,
        },
        item_details: [
            {
                id: pkg.id.toString(),
                price: pkg.finalPrice,
                quantity: 1,
                name: `${pkg.coin} coins`,
                brand: 'R Short',
                merchant_name: 'R Short',
            },
        ],
        expiry: {
            unit: 'minutes',
            duration: 15,
        },
        page_expiry: {
            unit: 'minutes',
            duration: 15,
        },
    };

    const token: string = await snap.createTransactionToken(parameter);

    await db.insert(Transaction).values({ user_id: userId, package_id: pkg.id, order_id: orderId, amount: pkg.finalPrice });

    return NextResponse.json({ token }, { status: 200 });
}

function generateOrderId(): string {
    const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return 'Order-' + Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
