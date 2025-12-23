import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { getAuthUser } from "../../../../lib/auth";
import { createAssignmentSchema } from "../../../../lib/validators/assignment";
import { log } from "console";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const resolvePromise = await params;
  const user = await getAuthUser();

  console.log(user);
  try {
    if (!user || user.role !== "INSTRUCTOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const course = await prisma.course.findUnique({
      where: { id: resolvePromise.courseId },
    });

    if (!course || course.instructorId !== user.userId) {
      return NextResponse.json(
        { message: "Not course owner" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const data = createAssignmentSchema.parse(body);

    const assignment = await prisma.assignment.create({
      data: {
        ...data,
        courseId: resolvePromise.courseId,
        status: "PUBLISHED",
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (err) {
    log(err);
    NextResponse.json({ msg: "Failed to create assignment" }, { status: 500 });
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const resolveParams = await params;
  const assignments = await prisma.assignment.findMany({
    where: {
      courseId: resolveParams.courseId,
      status: "PUBLISHED",
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assignments);
}
