import { adminDB } from "../../../../lib/db";
import { NextResponse, NextRequest } from "next/server";

interface RequestInterface {
  file: string;
  title: string;
  track?: string;
  userId: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userId, track, title, file }: RequestInterface =
      (await req.json()) as RequestInterface;

    const collections = await adminDB.papers.create({
      data: {
        file: file,
        title: title,
        track: track,
        authorId: userId,
      },
    });

    if (collections) {
      return NextResponse.json(
        {
          status: true,
          message: "Paper submitted successfully",
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
