import { adminDB } from "../../../../lib/db";
import { NextResponse, NextRequest } from "next/server";

interface RequestInterface {
  paperId: string;
  userId?: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userId, paperId }: RequestInterface =
      (await req.json()) as RequestInterface;

    const collections = await adminDB.papers.findFirst({
      where: {
        id: paperId,
      },
    });

    if (collections) {
      const data = {
        id: collections.id,
        title: collections.title,
        authorId: collections.authorId,
        file: collections.file,
        track: collections.track,
        grade: userId
          ? collections?.grade?.find((item: any) => item.reviewerId === userId)
          : {},
      };
      return NextResponse.json(
        {
          status: true,
          data: data,
          message: "Papers detail successfully",
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
