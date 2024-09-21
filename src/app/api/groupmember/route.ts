import dbConnect from "../../lib/dbconnect";
import groupmember from "../../models/groupmember";

// Handle GET requests to fetch all group members
export async function GET() {
    try {
        await dbConnect();
        console.log("Connected to MongoDB");

        const res = await groupmember.find({});
        console.log(res)
        return new Response(JSON.stringify(res), { status: 200 });
    } catch (error) {
        console.error("Error fetching group members:", error);
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
    }
}

// Handle POST requests to create a new group member
export async function POST(req: Request) {
    const body = await req.json();
    const { groupname, groupID, userID } = body;

    try {
        await dbConnect();
        console.log("Connected to MongoDB");

        const res = await groupmember.create({ groupname, groupID, userID });
        return Response.json({ groupname: groupname, groupID: groupID, userID: userID });
    } catch (error) {
        console.error("Error creating group member:", error);
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
    }
}