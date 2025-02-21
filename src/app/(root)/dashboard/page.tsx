import { JSX } from 'react';
import { Button } from '@components/shadcn/button';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export default function DashboardPage(): JSX.Element {
    return (
        <div className="mt-12 md:mt-16">
            {/* <header className="text-end">
                <Link href="/generate">
                    <Button>Generate video</Button>
                </Link>
            </header> */}
            <main className="mt-12">
                <section className="flex items-center justify-between">
                    <div>
                        Content (4)
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost"><IoIosArrowBack /></Button>
                        <span>1 of 2</span>
                        <Button variant="ghost"><IoIosArrowForward /></Button>
                    </div>
                </section>
            </main>
        </div>
    );
}
