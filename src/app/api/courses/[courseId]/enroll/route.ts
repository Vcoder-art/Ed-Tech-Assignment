import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const resolvePromise = await params;
    const cookie = await cookies();
    const token = cookie.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: "STUDENT" | "INSTRUCTOR";
    };

    // Only students can enroll
    if (payload.role !== "STUDENT") {
      return NextResponse.json(
        { message: "Only students can enroll" },
        { status: 403 }
      );
    }

    // Check course exists
    const course = await prisma.course.findUnique({
      where: { id: resolvePromise.courseId },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    // Prevent instructor enrolling in own course
    if (course.instructorId === payload.userId) {
      return NextResponse.json(
        { message: "Instructor cannot enroll in own course" },
        { status: 400 }
      );
    }

    // Create enrollment (unique constraint handles duplicates)
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: payload.userId,
        courseId: resolvePromise.courseId,
      },
    });

    return NextResponse.redirect(
      new URL(
        `/dashboard/courses/${resolvePromise.courseId}`,
        process.env.NEXT_PUBLIC_APP_URL
      )
    );
  } catch (err: any) {
    // Duplicate enrollment case
    if (err.code === "P2002") {
      return NextResponse.json(
        { message: "Already enrolled" },
        { status: 409 }
      );
    }

    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
