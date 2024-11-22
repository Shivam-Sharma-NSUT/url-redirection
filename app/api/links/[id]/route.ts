import originalLink from "@/app/models/originalLink";
import dbConnect from "@/lib/dbConnect";
import { isEmpty, isString } from "lodash";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    dbConnect();
    const { id } = await params;
    if (isEmpty(id) || !isString(id)) {
        return Response.json({
            success: false,
            message: 'id must be string'
        });
    }
    try {
        await originalLink.findByIdAndDelete(id);
        return Response.json({success: true});
    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            error
        });
    }
};