import { JSX } from 'react';

export default function NotFound(): JSX.Element {
    return (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-semibold">404</h1>
            <h2 className="text-sm md:text-base">Page not found</h2>
        </span>
    );
}
