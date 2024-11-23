import { createSession } from "@/app/_lib/session";
import dbConnect from "@/lib/dbConnect";
import user, { User } from '@/app/models/user';
import bcrypt from 'bcrypt';
import { isEmpty } from "lodash";
import { LoginRequest, loginRequestValidations } from "@/app/schemas";

export async function POST(request: Request) {
    await dbConnect();
    console.log('login api called');
    
    const data: LoginRequest = await request.json();
    const validationResult = loginRequestValidations.safeParse(data);
    if (!validationResult.success) {
        return Response.json({ success: false, message: validationResult.error.issues.reduce((acc, issue) => `${acc}\n${issue.message}`, '') });
    }

    try {
        const { email, password } = data;
        const existingUser: User | null | undefined = await user.findOne({ email });
        if (isEmpty(existingUser)) return Response.json({ success: false, message: 'User not found' });
        const compareResult = await bcrypt.compare(password, existingUser.password);
        console.log(existingUser.password, compareResult);
        if (!compareResult) return Response.json({ success: false, message: 'email or password is wrong' });
        
        await createSession(existingUser.username, existingUser.email, (existingUser._id as string)?.toString());
        return Response.json({ success: true });
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, messag: 'Something went wrong' });
    }
}