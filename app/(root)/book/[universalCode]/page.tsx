import originalLink, { OriginalLink } from '@/app/models/originalLink';
import universalLink, { UniversalLink } from '@/app/models/universalLink';
import dbConnect from '@/lib/dbConnect';
import React from 'react'
import StoreList from './StoreList';
import './styles.css';

const Page = async ({ params }: { params: Promise<{ universalCode: string }> }) => {
    await dbConnect();
    const { universalCode } = await params;
    const [links, uLink]: [OriginalLink[], UniversalLink] = await Promise.all([
        originalLink.find({ universalLink: universalCode }),
        universalLink.findOne({ shortCode: universalCode })
    ])
    console.log(uLink);

    return (
        <div className='my-container'>
            <div className="background-container">
                <img src={uLink.imageLink} alt="Book Cover Background" />
            </div>
            <div className='flex flex-col items-center w-full h-full justify-center absolute' style={{ translate: '0% -5%' }} >
                <img src={uLink.imageLink} className='h-2/4 shadow-2xl' alt="Book Cover" />
            <StoreList links={links.map(({ originalLink, country }) => ({ originalLink, country }))} shortCode={universalCode}></StoreList>
            </div>
        </div>
    );
}

export default Page;