'server only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.HASHING_KEY);

const cookie = {
    name: 'session',
    options: { httpOnly: true, secure: true, sameSite: true, path: '/' },
    duration: 24 * 60 * 60 * 1000
}

export async function encrypt(payload: Record<string, string>) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime('1day')
        .sign(key);
}

export async function decrypt(session: string) {
    try {
        const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function createSession(username: string, email: string, userId: string) {
    const expires = new Date(Date.now() + cookie.duration);
    const session = await encrypt({ username, email, userId });

    (await cookies()).set(cookie.name, session, { ...cookie.options, expires });
};

export async function deleteSession() {
    (await cookies()).delete(cookie.name);
}