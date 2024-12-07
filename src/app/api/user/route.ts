// import prisma from "@/app/lib/prisma";
// import * as bcrypt from "bcrypt";

// interface RequestBody {
//   name: string;
//   email: string;
//   password: string;
// }

// export async function POST(request: Request) {
//   // request.json() 형식으로 body 부분 추출
//   const body: RequestBody = await request.json();

//   // DB User 테이블에 데이터 넣기
//   const user = await prisma.user.create({
//     data: {
//       name: body.name,
//       email: body.email,
//       password: await bcrypt.hash(body.password, 10),
//     },
//   });

//   // user 객체에서 password 부분을 제외하고 나머지 부분만 최종적으로 response 해주기
//   const { password, ...result } = user;
//   return new Response(JSON.stringify(result));
// }

import prisma from "@/app/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextResponse } from "next/server";

interface RequestBody {
  name: string;
  email: string;
  password: string;
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
        { error: "이미 존재하는 이메일입니다." },
        { status: 400 }
      );
    }

    // DB User 테이블에 데이터 넣기
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
      },
    });

    // user 객체에서 password 부분을 제외하고 나머지 부분만 최종적으로 response 해주기
    const { password, ...result } = user;
    return new Response(JSON.stringify(result));
    
  } catch (error) {
    console.error("회원가입 에러:", error);
    return NextResponse.json(
      { error: "회원가입 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}