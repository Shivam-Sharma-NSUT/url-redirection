import React from 'react'
import { ChartNoAxesCombined, Expand } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

const UniversalLinkActions = ({ shortCode }: { shortCode: string }) => {
  return (
    <div className='flex gap-3'>
      <Link href={`/dashboard/analytics/${shortCode}`}>
        <Button className='bg-blue-300 text-black hover:bg-blue-400'>
          <ChartNoAxesCombined /> Analytics
        </Button>
      </Link>
      <Link href={`/dashboard/details/${shortCode}`}>
        <Button className='bg-blue-300 text-black hover:bg-blue-400'>
          <Expand /> Expand
        </Button>
      </Link>
    </div>
  )
}

export default UniversalLinkActions