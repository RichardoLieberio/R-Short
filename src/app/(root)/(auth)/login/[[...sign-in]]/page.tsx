import { JSX } from 'react';
import { SignIn } from '@clerk/nextjs';
import ClerkForm from '@/components/ClerkForm';

export default function LoginPage(): JSX.Element {
    return (
        <div className="absolute top-1/2 -translate-y-1/2 flex justify-center">
            <ClerkForm>
                <SignIn />
            </ClerkForm>
        </div>
    );
}
