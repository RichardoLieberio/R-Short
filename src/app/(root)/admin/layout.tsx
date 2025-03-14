import { ReactNode, JSX } from 'react';

export const metadata: object = {
    title: 'R Short - Admin Dashboard',
    description: 'Manage users, track revenue, and gain insights into platform performance with real-time analytics.',
};

type AdminLayoutProps = {
    totalRevenue: ReactNode,
    totalUser: ReactNode,
    revenueChart: ReactNode,
    userTable: ReactNode,
};

export default function AdminLayout({ totalRevenue, totalUser, revenueChart, userTable }: AdminLayoutProps): JSX.Element {
    return (
        <>
            <header className="mt-12 flex items-center gap-4">
                <div className="flex-1 max-w-52">
                    { totalRevenue }
                </div>
                <div className="flex-1 max-w-52">
                    { totalUser }
                </div>
            </header>
            <main className="mt-20 mb-16 space-y-20">
                { revenueChart }
                { userTable }
            </main>
        </>
    );
}
