import { JSX } from 'react';
import { SignIn } from '@clerk/nextjs';

export default function LoginPage(): JSX.Element {
    return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <SignIn />
        </div>
    );
}
