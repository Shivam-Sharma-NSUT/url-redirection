import { deleteSession } from "@/app/_lib/session";

export async function POST(request: Request) {
    await deleteSession();
    return Response.json({ success: true });
}