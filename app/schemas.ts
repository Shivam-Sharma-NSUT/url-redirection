import { z } from 'zod';

export interface LoginRequest {
    email: string;
    password: string;
};

const email = z.string({
    invalid_type_error: 'email must be string',
    required_error: 'email is a required field'
}).email('invalid email');

const password = z.string({
    invalid_type_error: 'password must be string',
    required_error: 'password is a required field'
}).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, '- must be atleast 8 character long\n- must contain at least 1 uppercase letter\n- must contain atleast 1 lowercase letter\n- must contain atleast 1 number\n- can contain special characters');

const confirmPassword = z.string({
    invalid_type_error: 'password must be string',
    required_error: 'password is a required field'
});

const username = z.string({
    invalid_type_error: 'username must be string',
    required_error: 'username is a required field'
});

export const loginRequestValidations = z.object({
    email,
    password,
});

export interface SignUpRequest {
    username: string;
    email: string;
    password: string;
};

export const signUpRequestValidations = z.object({
    username,
    email,
    password,
    confirmPassword
}).superRefine(({ password, confirmPassword }, ctx) => {
    if (password != confirmPassword) {
        ctx.addIssue({
            code: 'custom',
            message: 'password did not match',
            path: ['confirmPassword']
        });
    }
});