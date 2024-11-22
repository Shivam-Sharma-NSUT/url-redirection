import { HOST_URL, SHORT_URL_CREATION_RETRY_COUNT, SHORT_URL_LENGTH } from "@/app/constants";
import universalLink, { UniversalLink } from "@/app/models/universalLink";
import dbConnect from "@/lib/dbConnect";
import { MongoError } from "mongodb";
import { z } from 'zod';

interface CreateRequest {
    title: string;
};

const createRequestValidations = z.object({
    title: z.string({
            required_error: 'title is a required field',
            invalid_type_error: 'title must be string'
        }).min(1, 'title must not be empty'),
});

const generateUniqueShortCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let link = '';
    for(let i = 0; i < SHORT_URL_LENGTH; i++) {
        const ch = Math.floor(Math.random() * characters.length);
        link += characters[ch];
    }
    
    return link;
};

export async function POST(request: Request) {
    await dbConnect();
    const data: CreateRequest = await request.json();
    const validationResult = createRequestValidations.safeParse(data);
    if (!validationResult.success) {
        return Response.json({ success: false, error: validationResult.error.issues });
    }

    const createdBy = 'shivam Bhai';
    const { title } = data;

    for(let i = 0; i < SHORT_URL_CREATION_RETRY_COUNT; i++) {
        try {
            const randomCode = generateUniqueShortCode();
            const response: UniversalLink = await universalLink.create({
                title,
                shortCode: randomCode,
                createdBy
            });
    
            return Response.json({ success: true, link: `${HOST_URL}/${response.shortCode}` });
        } catch (error: unknown) {
            if ((error as MongoError)?.code === 11000 && i < SHORT_URL_CREATION_RETRY_COUNT - 1) continue;
            console.log(JSON.stringify({
                methodName: 'createLink',
                payload: data,
                error
            }));
            return Response.json({ success: false, error });
        }
    }
};