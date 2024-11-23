import universalLink, { UniversalLink } from '@/app/models/universalLink';
import { isEmpty } from 'lodash';
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { HOST_URL } from '@/app/constants';
import CopyButton from './CopyButton';
import UniversalLinkActions from './UniversalLinkActions';
import dbConnect from '@/lib/dbConnect';
import { headers } from 'next/headers';

const UniversalLinks = async () => {
  await dbConnect();
  const headersList = await headers();
  const createdBy = headersList.get('email');
  const links: UniversalLink[] = await universalLink.find({ createdBy });
  links.reverse();
  if (isEmpty(links)) return (
    <section className="flex flex-row gap-3 flex-wrap content-stretch">
      No Links Present
    </section>
  );

  return (
    <section className="flex flex-row gap-3 flex-wrap content-stretch">
      {
        links.map(link => (
          <Card className="min-w-80 max-w-96" key={link.shortCode}>
            <CardHeader>
              <CardTitle>{link.title}</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-row justify-between'>
              <Link href={link.shortCode}>{`${HOST_URL}/${link.shortCode}`}</Link>
              <CopyButton content={`${HOST_URL}/${link.shortCode}`}/>
            </CardContent>
            <CardFooter>
              <UniversalLinkActions shortCode={link.shortCode}/>
            </CardFooter>
          </Card>
        ))
      }

    </section>
  )
}

export default UniversalLinks;