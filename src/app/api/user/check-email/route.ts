// src/app/api/user/check-email/route.ts
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

interface RequestBody {
  email: string;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();

    // 이메일 중복 체크
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다." },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "사용 가능한 이메일입니다." });
    
  } catch (error) {
    console.error("이메일 중복 확인 에러:", error);
    return NextResponse.json(
      { error: "이메일 중복 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}