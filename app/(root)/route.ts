export async function GET() {
    return Response.redirect(process.env.DEFAULT_AUTHOR_PAGE as string);
};
