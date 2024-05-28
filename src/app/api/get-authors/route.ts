import { adminDB } from "../../../../lib/db";
import { NextResponse, NextRequest } from "next/server";

interface RequestInterface {
  userId: string;
  track: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userId, track }: RequestInterface =
      (await req.json()) as RequestInterface;

    const user: any = await adminDB.users.findFirst({
      where: {
        id: userId,
      },
    });

    if (user.role !== "admin") {
      return NextResponse.json(
        { status: false, message: "Only admins are allowed" },
        { status: 404 }
      );
    }

    const authors: any = await adminDB.users.findMany({
      where: {
        role: "author",
      },
    });

    if (authors) {
      return NextResponse.json(
        {
          status: true,
          data: authors,
          message: "Authors listing successfully",
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
