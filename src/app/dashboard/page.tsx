import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "../lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    role: "INSTRUCTOR" | "STUDENT";
  };

  let courseCount = 0;
  let assignmentCount = 0;
  let submissionCount = 0;

  if (payload.role === "INSTRUCTOR") {
    courseCount = await prisma.course.count({
      where: { instructorId: payload.userId },
    });

    assignmentCount = await prisma.assignment.count({
      where: {
        course: { instructorId: payload.userId },
      },
    });

    submissionCount = await prisma.submission.count({
      where: {
        assignment: {
          course: { instructorId: payload.userId },
        },
      },
    });
  } else {
    courseCount = await prisma.course.count({
      where: { isPublished: true },
    });

    assignmentCount = await prisma.assignment.count({
      where: {
        course: { isPublished: true },
      },
    });

    submissionCount = await prisma.submission.count({
      where: { studentId: payload.userId },
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back! Here’s what’s happening.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Courses" value={courseCount} />
        <StatCard label="Assignments" value={assignmentCount} />
        <StatCard label="Submissions" value={submissionCount} />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        {payload.role === "INSTRUCTOR" && (
          <>
            <Link
              href="/dashboard/courses/create"
              className="bg-black text-white px-4 py-2 rounded"
            >
              + Create Course
            </Link>

            <Link
              href="/dashboard/courses"
              className="border px-4 py-2 rounded"
            >
              View Courses
            </Link>
          </>
        )}

        {payload.role === "STUDENT" && (
          <Link
            href="/dashboard/courses"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Browse Courses
          </Link>
        )}
      </div>
    </div>
  );
}

/* Reusable stat card */
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
