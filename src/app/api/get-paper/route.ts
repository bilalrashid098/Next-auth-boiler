import { calculateAverageGrade } from "@/utils/get-average-grade";
import { adminDB } from "../../../../lib/db";
import { NextResponse, NextRequest } from "next/server";

interface RequestInterface {
  userId: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userId }: RequestInterface = (await req.json()) as RequestInterface;

    const collections: any = await adminDB.papers.findMany({
      where: {
        authorId: userId,
      },
    });

    if (collections) {
      const updatedCollection = collections?.map((collection: any) => {
        if (collection?.grade?.length > 0) {
          collection.avgGrade = calculateAverageGrade(collection?.grade);
        }
        return collection;
      });

      return NextResponse.json(
        {
          status: true,
          data: updatedCollection,
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
