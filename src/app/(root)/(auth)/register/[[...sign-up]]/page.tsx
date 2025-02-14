import { JSX } from 'react';
import { SignUp } from '@clerk/nextjs';
import ClerkForm from '@/components/ClerkForm';

export default function RegisterPage(): JSX.Element {
    return (
        <div className="absolute top-1/2 -translate-y-1/2 flex justify-center">
            <ClerkForm>
                <SignUp />
            </ClerkForm>
        </div>
    );
}
