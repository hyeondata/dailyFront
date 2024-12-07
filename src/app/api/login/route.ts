import prisma from "@/app/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextResponse } from "next/server";

interface RequestBody {
  username: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    console.log("Login attempt for:", body.username);

    const user = await prisma.user.findFirst({
      where: {
        email: body.username,
      },
    });

    if (!user) {
      console.log("User not found");
      return NextResponse.json(null);
    }

    const isValid = await bcrypt.compare(body.password, user.password);
    
    if (isValid) {
      console.log("Login successful");
      const { password, ...userWithoutPass } = user;
      return NextResponse.json(userWithoutPass);
    }

    console.log("Invalid password");
    return NextResponse.json(null);

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(null);
  }
}