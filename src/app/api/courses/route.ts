import { NextResponse } from "next/server";
import { prisma } from "../../lib/db";
import { getAuthUser } from "../../lib/auth";
import { createCourseSchema } from "../../lib/validators/course";

export async function POST(req: Request) {
  const user = await getAuthUser();

  if (!user || user.role !== "INSTRUCTOR") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const data = createCourseSchema.parse(body);

  const course = await prisma.course.create({
    data: {
      ...data,
      instructorId: user.userId,
    },
  });

  return NextResponse.json(course, { status: 201 });
}

export async function GET(req: Request) {
  const user = await getAuthUser();
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = 10;
  const skip = (page - 1) * limit;

  const where =
    user?.role === "INSTRUCTOR"
      ? { instructorId: user.userId }
      : { isPublished: true };

  const courses = await prisma.course.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ page, courses });
}
