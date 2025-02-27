import { JSX } from 'react';
import Link from 'next/link';
import { Button } from '@components/shadcn/button';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export default function VideoPagination({ page, total }: { page: number, total: number }): JSX.Element {
    const totalPages: number = Math.ceil(total / 5);
    let pages: number[];

    if (totalPages <= 3) pages = Array.from({ length: totalPages }).map((_, index) => index + 1);
    else if (page === 1) pages = [ 1, 2, 3 ];
    else if (page === totalPages) pages = [ page - 2, page - 1, page ];
    else pages = [ page - 1, page, page + 1 ];

    return (
        <div className="flex items-center justify-center gap-2">
            {
                page === 1
                    ? <Button variant="ghost" disabled><IoIosArrowBack /></Button>
                    : <Link href={`?page=${page - 1}`}>
                        <Button variant="ghost"><IoIosArrowBack /></Button>
                    </Link>
            }
            {
                pages.map((buttonPage) => (
                    page === buttonPage
                        ? <Button key={buttonPage} variant="outline">{ buttonPage }</Button>
                        : <Link key={buttonPage} href={`?page=${buttonPage}`}>
                            <Button variant="ghost">{ buttonPage }</Button>
                        </Link>
                ))
            }
            {
                page === totalPages
                    ? <Button variant="ghost" disabled><IoIosArrowForward /></Button>
                    : <Link href={`?page=${page + 1}`}>
                        <Button variant="ghost"><IoIosArrowForward /></Button>
                    </Link>
            }
        </div>
    );
}
