import { adminDB } from "../../../../../lib/db";
import { NextResponse, NextRequest } from "next/server";

interface RequestInterface {
  userId: string;
  date: any;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userId, date }: RequestInterface =
      (await req.json()) as RequestInterface;

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

    const deadline: any = await adminDB.setting.findFirst();
    var collection;
    if (deadline) {
      collection = await adminDB.setting.update({
        where: {
          id: date.id,
        },
        data: {
          deadline: date.deadline,
        },
      });
    } else {
      collection = await adminDB.setting.create({
        data: date,
      });
      console.log(collection);
    }

    if (collection) {
      return NextResponse.json(
        {
          status: true,
          message: "Deadline updated successfully",
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
