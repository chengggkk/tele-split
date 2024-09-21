import dbConnect from "../../lib/dbconnect";
import sharelink from "../../models/sharelink";

export async function GET() {
    try {
        await dbConnect();
        console.log("Connected to MongoDB");

        const res = await sharelink.find({});
        return new Response(JSON.stringify(res));
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
    }
}

export async function POST(req: Request) {
    const body = await req.json();
    const { sender, sharelink: shareLink, groupID, generateTIME, groupname, receiver } = body;

    try {
        await dbConnect();
        console.log("Connected to MongoDB");

        const res = await sharelink.create({
            sender,
            sharelink: shareLink,
            groupID,
            generateTIME,
            groupname,
            receiver
        });
        return new Response(JSON.stringify(res));
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
    }
}