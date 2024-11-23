import { createSession } from "@/app/_lib/session";
import dbConnect from "@/lib/dbConnect";
import user, { User } from '@/app/models/user';
import bcrypt from 'bcrypt';
import { SignUpRequest, signUpRequestValidations } from "@/app/schemas";
import { MongoError } from "mongodb";

export async function POST(request: Request) {
    await dbConnect();
    
    const data: SignUpRequest = await request.json();
    const validationResult = signUpRequestValidations.safeParse(data);
    if (!validationResult.success) {
        return Response.json({ success: false, message: validationResult.error.issues.reduce((acc, issue) => `${acc}\n${issue.message}`, '') });
    }

    try {
        const { username, email, password } = data;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { _id: userId }: User = await user.create({ username, email, password: hashedPassword });
        
        await createSession(username, email, (userId as string)?.toString());
        return Response.json({ success: true });
    } catch (error) {
        console.log(error);
        if ((error as MongoError)?.code === 11000) return Response.json({ success: false, message: 'Account already present, please login' });
        return Response.json({ success: false, message: 'Something went wrong' }); 
    }
}