import { adminDB } from "../../../../lib/db";

import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";

interface RequestInterface {
  role: string;
  name: string;
  email: string;
  password: string;
  track?: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { name, email, password, role, track }: RequestInterface =
      (await req.json()) as RequestInterface;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Check if email already exists
    const existingUser = await adminDB.users.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { status: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    var collections;

    if (role === "reviewer") {
      collections = await adminDB.users.create({
        data: {
          name: name,
          email: email,
          password: hash,
          role: role,
          track: track,
        },
      });
    } else {
      collections = await adminDB.users.create({
        data: {
          name: name,
          email: email,
          password: hash,
          role: role,
        },
      });
    }

    if (collections) {
      const data = {
        id: collections.id,
        name: collections.name,
        email: collections.email,
        role: collections.role,
        track: collections.track,
      };
      return NextResponse.json(
        {
          status: true,
          data: data,
          message: "Account created successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: false, message: "Failed to create account" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log("[POST SITE SETTING]", error);
    return new NextResponse("Internal Server Error", { status: 500 }); // Handle errors
  }
}
