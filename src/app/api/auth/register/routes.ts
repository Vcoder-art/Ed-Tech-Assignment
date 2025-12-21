import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../lib/db";
import { registerSchema } from "../../../lib/validators/auth";
import { signToken, setAuthCookie } from "../../../lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || "STUDENT",
      },
    });

    const token = signToken({
      userId: user.id,
      role: user.role,
    });

    setAuthCookie(token);

    return NextResponse.json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Registration failed" },
      { status: 400 }
    );
  }
}
