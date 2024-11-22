'use client';
import { Card } from '@/components/ui/card';
import { map } from 'lodash';
import Link from 'next/link';
import React from 'react'

interface StoreListProps {
    links: {
        originalLink: string;
        country: string;
    }[],
    shortCode: string;
};

const StoreList = ({ links }: StoreListProps) => {
    return (
        <div className='flex w-full h-fit items-center justify-center gap-4 p-8 flex-wrap'>
            {
                map(links, link => (
                    <Link href={link.originalLink} className='text-xl' key={link.country}>
                        <Card className='w-40 flex items-center justify-center p-4 bg-green-100 hover:bg-green-200' key={link.country}>
                            Amazon {link.country}
                        </Card>
                    </Link>
                ))
            }
        </div>
    )
}

export default StoreList