import React, { useState } from 'react'
import AuthWrapper from './AuthWrapper'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUpRequestValidations } from '@/app/schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import Loader from '../Loader';
import { Eye, EyeClosed } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(signUpRequestValidations),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    });

    async function onSubmit(values: z.infer<typeof signUpRequestValidations>) {
        setIsLoading(true);
        try {
            const { data } = await axios.post('/api/signUp', values);
            if (!data.success) {
                toast({
                    title: data.message,
                    variant: 'notify'
                });
            } else {
                toast({
                    title: 'signUp successful',
                    variant: 'success'
                });
                router.push('/dashboard');
            }
        } catch (error) {
            console.log(error);
            toast({
                title: 'failed to signUp',
                variant: 'destructive'
            });
        }
        setIsLoading(false);
    }

    return (
        <AuthWrapper
            title='Register'
            label='Create an account'
            backButtonHref='/login'
            backButtonLabel='Already have an account? Login here'
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" placeholder="Enter username"></Input>
                                    </FormControl>
                                    <FormMessage className='whitespace-pre-wrap' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" placeholder="Enter Email"></Input>
                                    </FormControl>
                                    <FormMessage className='whitespace-pre-wrap' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input {...field} type={showPassword ? "text" : "password"} placeholder="Enter password" className='hide-password-toggle pr-10'>
                                            </Input>
                                        </FormControl>
                                        <div className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent">
                                            {showPassword ? <Eye onClick={(() => setShowPassword(false))} /> : <EyeClosed onClick={(() => setShowPassword(true))} />}
                                        </div>
                                    </div>
                                    <FormMessage className='whitespace-pre-wrap' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='confirmPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input {...field} type={showPassword ? "text" : "password"} placeholder="Confirm password" className='hide-password-toggle pr-10'>
                                            </Input>
                                        </FormControl>
                                        <div className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent">
                                            {showPassword ? <Eye onClick={(() => setShowPassword(false))} /> : <EyeClosed onClick={(() => setShowPassword(true))} />}
                                        </div>
                                    </div>
                                    <FormMessage className='whitespace-pre-wrap' />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <Loader /> : 'Register'}</Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}

export default Register