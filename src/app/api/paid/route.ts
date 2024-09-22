import dbConnect from "../../lib/dbconnect";
import splitmember from "../../models/splitmember";


export async function POST(req: Request) {
    const body = await req.json();
    const { split_id, } = body;

    console.log("Received body:", body);  // Add logging to check what is received


    try {
        await dbConnect();
        console.log("Connected to MongoDB");

        const res = await splitmember.updateOne({ split_id }, { $set: { state: 1 } });
        return new Response(JSON.stringify(res));
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
    }
}