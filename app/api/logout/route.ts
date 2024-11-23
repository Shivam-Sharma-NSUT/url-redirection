import { deleteSession } from "@/app/_lib/session";

export async function POST() {
    await deleteSession();
    return Response.json({ success: true });
}