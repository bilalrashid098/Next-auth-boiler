import { adminDB } from "../../../../../lib/db";
import { NextResponse, NextRequest } from "next/server";

interface RequestInterface {
  userId: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userId }: RequestInterface = (await req.json()) as RequestInterface;

    const user: any = await adminDB.users.findFirst({
      where: {
        id: userId,
      },
    });

    if (user.role !== "admin") {
      return NextResponse.json(
        { status: false, message: "Failed to get papers" },
        { status: 404 }
      );
    }

    const collections = await adminDB.setting.findFirst();

    if (collections) {
      return NextResponse.json(
        {
          status: true,
          data: collections,
          message: "Deadline fetched successfully",
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
