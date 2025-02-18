import { JSX } from 'react';
import { SignUp } from '@clerk/nextjs';
import ClerkForm from '@/components/ClerkForm';

export default function RegisterPage(): JSX.Element {
    return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <ClerkForm>
                <SignUp />
            </ClerkForm>
        </div>
    );
}
