import { adminDB } from "../../../../../lib/db";
import { NextResponse, NextRequest } from "next/server";

interface RequestInterface {
  userId: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userId }: RequestInterface = (await req.json()) as RequestInterface;

    const collections = await adminDB.papers.findMany({
      where: {
        reviewerId: {
          hasSome: [userId],
        },
      },
    });

    if (collections) {
      const updateData = collections?.map((collection: any) => {
        return {
          id: collection.id,
          title: collection.title,
          authorId: collection.authorId,
          reviewerId: userId,
          file: collection.file,
          track: collection.track,
          grade:
            collection?.grade?.find(
              (item: any) => item.reviewerId === userId
            ) || {},
        };
      });
      return NextResponse.json(
        {
          status: true,
          data: updateData,
          message: "Papers listing successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: false, message: "Failed to get papers" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log("[POST SITE SETTING]", error);
    return new NextResponse("Internal Server Error", { status: 500 }); // Handle errors
  }
}
