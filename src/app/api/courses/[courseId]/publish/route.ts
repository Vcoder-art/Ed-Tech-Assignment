import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const resolvePromise = await params;
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    role: "INSTRUCTOR" | "STUDENT";
  };

  if (payload.role !== "INSTRUCTOR") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const course = await prisma.course.findUnique({
    where: { id: resolvePromise.courseId },
  });

  if (!course || course.instructorId !== payload.userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.course.update({
    where: { id: resolvePromise.courseId },
    data: { isPublished: !course.isPublished },
  });

  const message = updated.isPublished ? "published" : "unpublished";

  return NextResponse.redirect(
    new URL(
      `/dashboard/courses?status=${message}`,
      process.env.NEXT_PUBLIC_APP_URL
    )
  );
}
