import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import AuthHeader from './AuthHeader';
import BackButton from './BackButton';

interface AuthWrapperProps {
    label: string;
    title: string;
    backButtonHref: string;
    backButtonLabel: string;
    children: React.ReactNode;
}

const AuthWrapper = ({ label, title, backButtonHref, backButtonLabel, children }: AuthWrapperProps) => {
  return (
    <Card className='xl:w-1/4 md:1/2 shadow-md'>
        <CardHeader>
            <AuthHeader label={label} title={title}/>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
            <BackButton href={backButtonHref} label={backButtonLabel}/>
        </CardFooter>
    </Card>
  )
}

export default AuthWrapper