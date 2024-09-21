import dbConnect from '../../../lib/dbconnect';
import group from '../../../models/groups';  // Assuming your Group model is set up

// Define GET handler for dynamic routes
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    await dbConnect();
    // Find the group by `slug`, not `id`
    console.log(await group.findOne({_id: slug}));
    const foundGroup = await group.findOne({_id: slug});
    console.log(foundGroup)

    if (!foundGroup) {
      return Response.json({ error: 'Group not found' }, { status: 404 });
    }

    return Response.json({ groupname: foundGroup.groupname });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}