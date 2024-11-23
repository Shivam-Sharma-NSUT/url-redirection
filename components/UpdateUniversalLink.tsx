'use client';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "./ui/alert-dialog";
import Loader from "./Loader";
import refresh from "@/app/actions";

const formSchema = z.object({
    title: z.string({ invalid_type_error: 'title must be a string' }).min(1, 'title must not be empty string'),
    imageLink: z.string({ invalid_type_error: 'imageLink must be a string' }).min(1, 'imageLink must not be empty string')
});

interface UpdateUniversalLinkProps {
    title: string;
    imageLink: string;
    shortCode: string;
}

const UpdateUniversalLink = ({ imageLink, title, shortCode }: UpdateUniversalLinkProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);
    const [formData, setFormData] = useState({ title, imageLink });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title, imageLink },
    });
    const { toast } = useToast();


    function onSubmit(values: z.infer<typeof formSchema>) {
        setFormData(values);
        setShowConfirmationDialog(true);
    };

    async function onConfirmation() {
        setIsLoading(true);
        try {
            const { data } = await axios.post('/api/universalLink/update', { ...formData, universalLink: shortCode });
            if (!data.success) throw data.error;
            refresh('/dashboard/details/[shortCode]')
            toast({
                title: 'link updated successfully',
                variant: 'success'
            })
        } catch (error) {
            console.log(error);
            toast({
                title: 'failed to update link',
                variant: 'destructive'
            })
        } finally {
            setShowConfirmationDialog(false);
            setIsLoading(false);
        }
    }

    return (
        <div className='flex flex-col w-full'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Title</FormLabel>
                                <Input type="text" placeholder="Enter Title For the Link" {...field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageLink"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Image Link</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Enter Image Link" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="bg-green-300 text-black hover:bg-green-400 w-40" type="submit" disabled={isLoading}>Update</Button>
                </form>
            </Form>
            <AlertDialog open={showConfirmationDialog}>
                <AlertDialogContent style={{ overflowWrap: 'anywhere' }}>
                    {
                        <AlertDialogHeader >
                            <AlertDialogTitle>Title changed from <span className="text-red-500">{title}</span> to <span className="text-green-500">{formData.title}</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Image Link changed from <span className="font-bold text-red-500 underline text-lg"><a target="_blank" href={imageLink}>{imageLink}</a></span> to <span className="font-bold text-green-500 underline text-lg"><a target="_blank" href={formData.imageLink}>{formData.imageLink}</a></span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                    }
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setShowConfirmationDialog(false); }} disabled={isLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onConfirmation} disabled={isLoading}>{isLoading ? <Loader /> : "Continue"}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>)
}

export default UpdateUniversalLink