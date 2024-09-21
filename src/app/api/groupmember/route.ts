import dbConnect from "../../lib/dbconnect";
import groupmember from "../../models/groupmember";

// Handle GET requests to fetch all group members
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const groupID = searchParams.get('groupID');
        const userID = searchParams.get('userID');

        await dbConnect();

        let query = {};
        if (groupID) query = { ...query, groupID };
        if (userID) query = { ...query, userID };

        const res = await groupmember.find(query);
        return new Response(JSON.stringify(res), { status: 200 });
    } catch (error) {
        console.error("Error fetching group members:", error);
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
    }
}

// Handle POST requests to create a new group member
export async function POST(req: Request) {
    const body = await req.json();
    const { groupname, groupID, userID, address, userName, firstName, lastName, photoUrl } = body;

    try {
        console.log("address", address)

        await dbConnect();
        console.log("Connected to MongoDB");

        const foundUser = await groupmember.findOne({ groupID: groupID, userID: userID });
        if (foundUser !== null) {
            return Response.json(foundUser);
        }
        let savedGroup = undefined
        if (groupname === undefined) {
            savedGroup = await groupmember.findOne({ groupID: groupID });
        }

        const res = await groupmember.create({ groupname: groupname ?? savedGroup.groupname, groupID, userID, address, userName, firstName, lastName, photoUrl });
        return Response.json({ groupname: groupname, groupID: groupID, userID: userID, address: address, userName, firstName, lastName, photoUrl });
    } catch (error) {
        console.error("Error creating group member:", error);
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
    }
}