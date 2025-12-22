import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { getAuthUser } from "../../../../lib/auth";
import { createAssignmentSchema } from "../../../../lib/validators/assignment";
import { log } from "console";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  params = await params;
  console.log(params)
  const user = await getAuthUser();
  
  console.log(user);
  try {
    if (!user || user.role !== "INSTRUCTOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
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
        courseId: params.courseId,
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
  { params }: { params: { courseId: string } }
) {
  const assignments = await prisma.assignment.findMany({
    where: {
      courseId: params.courseId,
      status: "PUBLISHED",
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assignments);
}
