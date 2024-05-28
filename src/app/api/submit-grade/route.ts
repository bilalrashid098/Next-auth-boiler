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

    const setting: any = await adminDB.setting.findFirst();

    if (setting && new Date() < new Date(setting?.deadline)) {
      return NextResponse.json(
        { status: false, message: "You cannot submit grades before deadline" },
        { status: 400 }
      );
    }

    const collections: any = await adminDB.papers.findFirst({
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

      // Check if the reviewer has already graded the paper
      const existingGradeIndex = collections.grade.findIndex(
        (entry: any) => entry.reviewerId === userId
      );

      if (existingGradeIndex !== -1) {
        // Update the existing grade and comment
        collections.grade[existingGradeIndex].grade = grade;
        collections.grade[existingGradeIndex].comment = comment;
      } else {
        // Add a new grade entry
        collections.grade.push(data);
      }

      await adminDB.papers.update({
        where: {
          id: paperId,
        },
        data: {
          grade: collections.grade,
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
