'use client';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'

const Logout = ({ className }: { className: string }) => {
    const router = useRouter();
    const { toast } = useToast();
    const onClick = async () => {
        try {
            const { data } = await axios.post('/api/logout');
            if (!data.success) {
                throw 'logout failed';
            }
            toast({
                title: 'log out successful',
                variant: 'success'
            })
            router.push('/login');
        } catch (error) {
            console.log(error);
            toast({
                title: 'log out failed',
                variant: 'destructive'
            })
        }
    };
    return (
        <div className={className} onClick={onClick}>Log Out</div>
    )
}

export default Logout