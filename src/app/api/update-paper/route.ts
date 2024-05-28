import { adminDB } from "../../../../lib/db";
import { NextResponse, NextRequest } from "next/server";

interface RequestInterface {
  userId: string;
  id: string;
  file: string;
  title: string;
  track?: string;
  authorId: string;
  reviewerId: any;
  grade: any;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const {
      id,
      userId,
      track,
      title,
      file,
      authorId,
      reviewerId,
      grade,
    }: RequestInterface = (await req.json()) as RequestInterface;

    const collections = await adminDB.papers.update({
      where: {
        id,
      },
      data: {
        file: file,
        title: title,
        track: track,
        authorId: authorId,
        reviewerId: reviewerId,
        grade: grade,
      },
    });

    if (collections) {
      return NextResponse.json(
        {
          status: true,
          message: "Paper updated successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: false, message: "Failed to submit paper" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log("[POST SITE SETTING]", error);
    return new NextResponse("Internal Server Error", { status: 500 }); // Handle errors
  }
}
