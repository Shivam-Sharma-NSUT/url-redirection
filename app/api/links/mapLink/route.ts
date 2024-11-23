import originalLink from '@/app/models/originalLink';
import universalLink from '@/app/models/universalLink';
import dbConnect from '@/lib/dbConnect';
import { headers } from 'next/headers';
import { z } from 'zod';

interface AppendRequest {
    universalLink: string;
    originalLink: string;
    country: string;
    city?: string;
};

const appendRequestValidations = z.object({
    universalLink: z
        .string({
            required_error: 'universalLink is a required field',
            invalid_type_error: 'universalLink must be string'
        }).min(1, 'universalLink must not be empty'),
    originalLink: z
        .string({
            required_error: 'title is a required field',
            invalid_type_error: 'title must be string'
        })
        .min(1, 'originalLink must not be empty'),
    country: z.string()
});

export async function POST(request: Request) {
    await dbConnect();
    const data: AppendRequest = await request.json();
    const validationResult = appendRequestValidations.safeParse(data);
    if (!validationResult.success) {
        return Response.json({ success: false, error: validationResult.error.issues });
    }
    try {
        const isValidUniversalLink = await universalLink.exists({ shortCode: data.universalLink });
        if (!isValidUniversalLink) {
            return Response.json({ success: false, error: 'Invalid Universal Link' });
        }
        const headersList = await headers();
        const createdBy = headersList.get('email');
        const { universalLink: uLink, originalLink: oLink, city, country } = data;
        await originalLink.create({ universalLink: uLink, originalLink: oLink, country, city, createdBy })

        return Response.json({ success: true });
    } catch (error) {
        console.log(JSON.stringify({
            methodName: 'appendLink',
            payload: data,
            error
        }));
        return Response.json({ success: false, error });
    }
};
