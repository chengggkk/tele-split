import dbConnect from "../../lib/dbconnect";
import splitmember from "../../models/splitmember";

export async function GET() {
    try {
        await dbConnect();
        console.log("Connected to MongoDB");

        const res = await splitmember.find({});
        return new Response(JSON.stringify(res));
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
    }
}

export async function POST(req: Request) {
    const body = await req.json();
    const { split_id, split_member, amount, state, name} = body;

    console.log("Received body:", body);  // Add logging to check what is received


    try {
        await dbConnect();
        console.log("Connected to MongoDB");

        const res = await splitmember.create({
            split_id,
            split_member,
            amount,
            state,
            name
        });
        return new Response(JSON.stringify(res));
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
    }
}