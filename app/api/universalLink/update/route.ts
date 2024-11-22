import universalLink from "@/app/models/universalLink";
import dbConnect from "@/lib/dbConnect";
import { z } from 'zod';

interface UpdateRequest {
    universalLink: string;
    imageLink: string;
    title: string;
};

const updateRequestValidations = z.object({
    universalLink: z
        .string({
            required_error: 'universalLink is a required field',
            invalid_type_error: 'universalLink must be string'
        })
        .min(1, 'universalLink must not be empty'),
    imageLink: z
        .string({
            required_error: 'imageLink is a required field',
            invalid_type_error: 'imageLink must be string'
        })
        .min(1, 'imageLink must not be empty'),
    title: z
        .string({
            required_error: 'title is a required field',
            invalid_type_error: 'title must be string'
        })
        .min(1, 'title must not be empty'),
});

export async function POST(request: Request) {
    await dbConnect();

    const data: UpdateRequest = await request.json();
    const validationResult = updateRequestValidations.safeParse(data);
    if (!validationResult.success) {
        return Response.json({ success: false, error: validationResult.error.issues });
    }
    const { universalLink: shortCode, imageLink, title } = data;
    try {
        const res = await universalLink.findOneAndUpdate({ shortCode }, { $set: { imageLink, title } }, { new: true });
        console.log(res, data);
        return Response.json({ success: true });
    } catch (error) {
        console.log(error);
        Response.json({ success: false, error });
    }
}