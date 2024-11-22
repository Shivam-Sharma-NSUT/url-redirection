'use client';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { map } from 'lodash';
import { LIST_OF_COUNTRIES } from '@/app/constants';
import CopyButton from "./CopyButton";
import axios from 'axios';
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "./ui/alert-dialog";
import { Trash2 } from "lucide-react";
import Loader from "./Loader";


const formSchema = z.object({
  country: z.string(), //.enum(LIST_OF_COUNTRIES.map(e => e.abbreviation)),
  originalLink: z.string({ invalid_type_error: 'link must be a string' }).min(1, 'link must not be empty string')
});


const OriginalLink = ({ link }: { link: { country: string, originalLink: string, id: string } }) => {
  const { country, originalLink, id } = link;
  const { toast } = useToast();
  const [formData, setFormData] = useState({ originalLink: '', country: '' });
  const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);
  const [toBeDeleted, setToBeDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { country, originalLink },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (country !== values.country || originalLink !== values.originalLink) {
      setFormData(values);
      return setShowConfirmationDialog(true);
    } else {
      toast({
        title: 'No Changes',
        variant: 'notify'
      })
    }
  }

  function onDelete() {
    setToBeDeleted(true);
    setShowConfirmationDialog(true);
  }

  async function onConfirmation() {
    setIsLoading(true);
    if (toBeDeleted) {
      // delete link flow
      try {
        const { data } = await axios.delete(`/api/links/${id}`);
        if (!data.success) throw data.error;
        toast({
          title: 'link deleted successfully',
          variant: 'success'
        })
      } catch (error) {
        console.log(error);
        toast({
          title: 'failed to delete link',
          variant: 'destructive'
        })
      } finally {
        setShowConfirmationDialog(false);
        setToBeDeleted(false);
      }
    } else {
      // update link flow
      try {
        const { data } = await axios.post('/api/links/updateLink', {
          ...formData,
          id
        });
        if (!data.success) throw data.error;
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
      }
    }
    setIsLoading(false);
  }

  return (
    <div className='flex flex-col w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-4 w-full mt-4 items-end">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="min-w-40">
                <FormLabel>Country</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
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
                  <Input type="text" placeholder="Enter Title For the Link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="h-full pb-2"><CopyButton content={originalLink} /></div>
          <div className="h-full pb-2"><Trash2 onClick={onDelete} /></div>
          {/* <Button className="bg-red-300 text-black hover:bg-green-400 w-20" type="submit">Delete</Button> */}
          <Button className="bg-green-300 text-black hover:bg-green-400 w-20" type="submit" disabled={isLoading}>Update</Button>
        </form>
      </Form>
      <AlertDialog open={showConfirmationDialog}>
        <AlertDialogContent className={toBeDeleted ? "bg-red-50 border-red-500 border-8" : "" }>
          {
            toBeDeleted ? (
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Deleting Link for <span className="text-red-500">{country}</span>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Link <span className="font-bold text-blue-500 underline text-lg"><a target="_blank" href={originalLink}>{originalLink}</a></span>
                </AlertDialogDescription>
              </AlertDialogHeader>
            ) : (
              <AlertDialogHeader>
                <AlertDialogTitle>Country changed from <span className="text-red-500">{country}</span> to <span className="text-green-500">{formData.country}</span>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Link changed from <span className="font-bold text-red-500 underline text-lg"><a target="_blank" href={originalLink}>{originalLink}</a></span> to <span className="font-bold text-green-500 underline text-lg"><a target="_blank" href={formData.originalLink}>{formData.originalLink}</a></span>
                </AlertDialogDescription>
              </AlertDialogHeader>
            )
          }

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setShowConfirmationDialog(false); setToBeDeleted(false); }} disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmation} disabled={isLoading}>{isLoading ? <Loader /> : "Continue"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default OriginalLink