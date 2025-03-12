import { ReactNode, JSX, Suspense } from 'react';
import Skeleton from '@components/Skeleton';

export const metadata: object = {
    title: 'R Short - Admin Dashboard',
    description: 'Manage users, track revenue, and gain insights into platform performance with real-time analytics.',
};

type AdminLayoutProps = {
    totalRevenue: ReactNode,
    totalUser: ReactNode,
    revenueChart: ReactNode,
};

export default function AdminLayout({ totalRevenue, totalUser, revenueChart }: AdminLayoutProps): JSX.Element {
    return (
        <>
            <header className="mt-12 flex items-center gap-4">
                <div className="flex-1 max-w-52">
                    <Suspense fallback={<Skeleton className="h-[98px] md:h-[102px] rounded-xl" />}>
                        { totalRevenue }
                    </Suspense>
                </div>
                <div className="flex-1 max-w-52">
                    <Suspense fallback={<Skeleton className="h-[98px] md:h-[102px] rounded-xl" />}>
                        { totalUser }
                    </Suspense>
                </div>
            </header>
            <main className="mt-12 mb-16">
                { revenueChart }
            </main>
        </>
    );
}
