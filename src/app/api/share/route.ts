import dbConnect from "../../lib/dbconnect";
import group from "../../models/createlink";

export async function GET() {
    try {
        await dbConnect();
        console.log("Connected to MongoDB");

        const res = await group.find({});
        return new Response(JSON.stringify(res));
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
    }
}

export async function POST(req: Request) {
    const body = await req.json();
    const { groupname } = body;

    try {
        await dbConnect();
        console.log("Connected to MongoDB");

        const res = await group.create({ groupname });
        return new Response(JSON.stringify(res));
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
    }
}