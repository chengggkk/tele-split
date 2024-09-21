import exp from "constants";
import dbConnect from "../../lib/dbconnect";
import split from "../../models/split";
import splitmember from "../../models/splitmember";
import { NextResponse } from 'next/server';
import { group } from "console";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const groupID = searchParams.get('groupID');
    const ID = searchParams.get('ID');

    await dbConnect();

    let query = {};
    if (groupID) query = { ...query, groupID };
    if (ID) query = { ...query, Payer: ID };


    try {
        await dbConnect();

        const splitData = await split.find(query);
        return NextResponse.json(splitData);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}


export async function POST(request: Request) {
    const { ID, groupID } = await request.json();

    

    try {
        await dbConnect();

        // Fetch all splits for the given groupID
        const splitData = await split.find({ groupID: groupID });

        if (splitData.length === 0) {
            return NextResponse.json({ error: 'No result', ID, groupID }, { status: 404 });
        }

        const results = await Promise.all(splitData.map(async (splitEntry) => {
            const splitMembers = await splitmember.find({ split_id: splitEntry._id });
            return {
                payer: splitEntry.Payer,
                splitMembers,
            };
        }));

        // Return all results for the groupID
        return NextResponse.json(results);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}