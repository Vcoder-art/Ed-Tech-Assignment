import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { getAuthUser } from "../../../lib/auth";
import { updateCourseSchema } from "../../../lib/validators/course";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const resolveParams = await params;
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const course = await prisma.course.findUnique({
    where: { id: resolveParams.courseId },
  });

  if (!course || course.instructorId !== user.userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const data = updateCourseSchema.parse(body);

  const updated = await prisma.course.update({
    where: { id: resolveParams.courseId },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const resolveParams = await params;
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const course = await prisma.course.findUnique({
    where: { id: resolveParams.courseId },
  });

  if (!course || course.instructorId !== user.userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await prisma.course.delete({
    where: { id: resolveParams.courseId },
  });

  return NextResponse.json({ message: "Course deleted" });
}
