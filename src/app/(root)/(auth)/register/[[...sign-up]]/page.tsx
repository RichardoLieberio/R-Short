import { JSX } from 'react';
import { SignUp } from '@clerk/nextjs';
import ClerkForm from '@components/ClerkForm';

export const metadata: object = {
    title: 'R Short - Register',
    description: 'Create an account on R Short and start generating high-quality AI-powered videos in seconds.',
};

export default function RegisterPage(): JSX.Element {
    return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <ClerkForm>
                <SignUp />
            </ClerkForm>
        </div>
    );
}
