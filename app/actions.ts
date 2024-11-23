'use server';
import { revalidatePath } from "next/cache";

export default async function refresh (path: string) {
    revalidatePath(path);
}
