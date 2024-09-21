import dbConnect from "../../lib/dbconnect";
import split from "../../models/split";

export async function GET() {
    try {
        await dbConnect();
        console.log("Connected to MongoDB");

        const res = await split.find({});
        return Response.json(res);
    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    const body = await req.json();
    const { Payer,name, Note, groupID } = body;

    try {
        await dbConnect();
        console.log("Connected to MongoDB");

        const res = await split.create({
            Payer,
            name,
            Note,
            groupID
        });
        return Response.json(res);
    } catch (error) {
        console.log("Error creating split:", error);
        return Response.json({ error: (error as Error).message }, { status: 400 });
    }
}