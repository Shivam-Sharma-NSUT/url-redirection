'use client';
import React, { useCallback, useState } from 'react'
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import Loader from './Loader';

const CreateLink = () => {
    const [title, setTitle] = useState<string>('');
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false); 


    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);
            await axios.post('/api/links/create', { title });

            toast({
                title: 'New Link Created Successfully',
                variant: 'success'
            });
        } catch (error) {
            toast({
                title: 'Something Went Wrong',
                variant: 'destructive'
            });
            console.log(error);
        }
        setIsLoading(false);
    }, [title, setIsLoading, toast]);

    return (
        <section>
            <Card className="border-2 shadow">
                <CardHeader>Create New Link</CardHeader>
                <CardContent className="flex flex-row gap-4 p-4">
                    <Input type="text" placeholder="Enter Title For the Link" className="" onChange={(e) => setTitle(e.target.value)}/>
                    <Button className="bg-green-300 text-black hover:bg-green-400" onClick={onSubmit}>{isLoading ? <Loader /> : "Create"}</Button>
                </CardContent>
            </Card>
        </section>
    )
}

export default CreateLink