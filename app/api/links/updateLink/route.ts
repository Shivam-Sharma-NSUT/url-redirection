import originalLink from '@/app/models/originalLink';
import dbConnect from '@/lib/dbConnect';
import { z } from 'zod';

interface UpdateRequest {
    id: string;
    originalLink: string;
    country: string;
    city?: string;
};

const updateRequestValidations = z.object({
    id: z
        .string({
            required_error: 'id is a required field',
            invalid_type_error: 'id must be string'
        })
        .min(1, 'id must not be empty'),
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
    const data: UpdateRequest = await request.json();
    const validationResult = updateRequestValidations.safeParse(data);
    if (!validationResult.success) {
        return Response.json({ success: false, error: validationResult.error.issues });
    }
    try {
        const { originalLink: oLink, city, country, id } = data;
        await originalLink.findByIdAndUpdate(id, { $set: { originalLink: oLink, country, city }});

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
