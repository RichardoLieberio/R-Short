import { NextResponse } from 'next/server';

export function POST(): NextResponse {
    console.log('Walauweee');
    return NextResponse.json({ message: 'Purchase successful' }, { status: 200 });
}
