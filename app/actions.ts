'use server';
import { revalidatePath } from "next/cache";

export default async function refresh(path: string) {
    revalidatePath(path);
}

interface LogInterface extends Record<string, unknown> {
    my_transaction_id: string;
}

export async function log(params: LogInterface) {
    const { my_transaction_id } = params;
    console.log(`${my_transaction_id} ${JSON.stringify(params)}`);
}