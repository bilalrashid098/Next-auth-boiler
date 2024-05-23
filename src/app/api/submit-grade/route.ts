import { adminDB } from "../../../../lib/db";
import { NextResponse, NextRequest } from "next/server";

interface RequestInterface {
  comment: string;
  paperId: string;
  grade?: string;
  userId: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userId, comment, grade, paperId }: RequestInterface =
      (await req.json()) as RequestInterface;

    const collections = await adminDB.papers.findFirst({
      where: {
        id: paperId,
      },
    });

    if (collections) {
      const data = {
        grade: grade,
        comment: comment,
        reviewerId: userId,
      };

      await adminDB.papers.update({
        where: {
          id: paperId,
        },
        data: {
          grade: collections?.grade ? [...collections?.grade, data] : [data],
        },
      });
      return NextResponse.json(
        {
          status: true,
          message: "Grade submitted successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: false, message: "Failed to submit grade" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log("[POST SITE SETTING]", error);
    return new NextResponse("Internal Server Error", { status: 500 }); // Handle errors
  }
}
