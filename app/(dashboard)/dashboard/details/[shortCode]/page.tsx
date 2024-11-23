import { HOST_URL } from '@/app/constants'
import originalLink, { OriginalLink as OriginalLinkInterface } from '@/app/models/originalLink'
import universalLink, { UniversalLink as UniversalLinkInterface } from '@/app/models/universalLink'
import AppendUrl from '@/components/AppendUrl'
import CopyButton from '@/components/CopyButton'
import Link from 'next/link'
import React from 'react'
import { map } from 'lodash';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import OriginalLink from '@/components/OriginalLink'
import dbConnect from '@/lib/dbConnect'
import UpdateUniversalLink from '@/components/UpdateUniversalLink'
import mongoose from 'mongoose'

const DetailsPage = async ({ params }: { params: Promise<{ shortCode: string }> }) => {
    await dbConnect();
    const { shortCode } = await params;

    const [links, shortLink]: [OriginalLinkInterface[], UniversalLinkInterface] = await Promise.all([
        originalLink.find({ universalLink: shortCode }),
        universalLink.findOne({ shortCode })
    ])

    return (
        <section className='flex flex-col w-full p-4'>
            <Card className='flex flex-col w-full p-5 h-fit shadow-lg '>
                <CardHeader>
                    <div className='flex gap-5 w-full'>
                        <CopyButton content={`${HOST_URL}/${shortCode}`} />
                        <Link href={`/${shortCode}`}>{`${HOST_URL}/${shortCode}`}</Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <UpdateUniversalLink title={shortLink.title} imageLink={shortLink.imageLink} shortCode={shortCode} />
                </CardContent>
            </Card>
            <AppendUrl shortCode={shortCode}/>
            <section className="flex flex-col gap-2 mt-4">
            {
                map(links.reverse(), ({ country, originalLink, _id }) => (
                    <Card key={country} className='w-full'>
                        <CardContent>
                            <OriginalLink link={{ country, originalLink, id: (_id as mongoose.Types.ObjectId).toString() }}/>
                        </CardContent>
                    </Card>
                ))
            }
            </section>
        </section>
    )
}

export default DetailsPage