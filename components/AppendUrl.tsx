'use client';
import React, { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useForm } from "react-hook-form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { LIST_OF_COUNTRIES } from '@/app/constants';
import { map } from 'lodash';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import Loader from './Loader';

const formSchema = z.object({
    country: z.string(), //.enum(LIST_OF_COUNTRIES.map(e => e.abbreviation)),
    originalLink: z.string({ invalid_type_error: 'link must be a string' }).min(1, 'link must not be empty string')
});

const AppendUrl = ({ shortCode }: { shortCode: string }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false); 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            country: "",
            originalLink: ""
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            const { data } = await axios.post('/api/links/mapLink', {
                ...values,
                universalLink: shortCode,
            });
            if (!data.success) throw data.error;
            toast({
                title: 'link added successfully',
                variant: 'success'
            })
        } catch (error) {
            console.log(error);
            toast({
                title: 'failed to add link',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="border-2 shadow">
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-4 w-full mt-4 items-end">
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem className="min-w-40">
                                    <FormLabel>Country</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Country" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {map(LIST_OF_COUNTRIES, country => (<SelectItem key={country.abbreviation} value={country.abbreviation}>{country.country}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="originalLink"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Link</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Enter Title For the Link" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="bg-green-300 text-black hover:bg-green-400 w-20" type="submit" disabled={isLoading}>{isLoading ? <Loader /> : "Create"}</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default AppendUrl