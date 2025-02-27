'use client';

import { JSX } from 'react';
import { VideoPaginationProps } from '../../types';
import { Button } from '@components/shadcn/button';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export default function VideoPagination({ total, page, setPage, prevPage, nextPage, getPages }: VideoPaginationProps): JSX.Element {
    return (
        <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" onClick={prevPage} disabled={page === 1}><IoIosArrowBack /></Button>
            {
                getPages().map((buttonPage) => (
                    <Button key={buttonPage} onClick={() => setPage(buttonPage)} variant={buttonPage === page ? 'outline' : 'ghost'}>{ buttonPage }</Button>
                ))
            }
            <Button variant="ghost" onClick={nextPage} disabled={page === Math.ceil(total / 5) || !total}><IoIosArrowForward /></Button>
        </div>
    );
}
