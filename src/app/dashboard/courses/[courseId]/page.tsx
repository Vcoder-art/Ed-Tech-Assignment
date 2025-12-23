import { requireAuth } from "../../../lib/auth-guards";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { prisma } from "@/app/lib/db";

export default async function CourseAssignmentsPage({
  params,
}: {
  params: { courseId: string };
}) {
  requireAuth();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    role: "STUDENT" | "INSTRUCTOR";
  };

  // ✅ DIRECT DB QUERY (NO FETCH)
  const assignments = await prisma.assignment.findMany({
    where: {
      courseId: params.courseId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Assignments</h1>

      {assignments.length === 0 && <p>No assignments</p>}

      {assignments.map((a) => (
        <div key={a.id} className="border p-3 rounded space-y-2">
          <h3 className="font-semibold">{a.title}</h3>
          <p className="text-sm text-gray-500">{a.description}</p>

          {/* STUDENT */}
          {payload.role === "STUDENT" && (
            <Link
              href={`/dashboard/assignments/${a.id}/submit`}
              className="text-blue-600 underline text-sm"
            >
              Submit Assignment
            </Link>
          )}

          {/* INSTRUCTOR */}
          {payload.role === "INSTRUCTOR" && (
            <Link
              href={`/dashboard/assignments/${a.id}/submissions`}
              className="text-green-600 underline text-sm"
            >
              View Submissions
            </Link>
          )}
        </div>
      ))}

      {/* INSTRUCTOR CREATE */}
      {payload.role === "INSTRUCTOR" && (
        <Link
          href={`/dashboard/courses/${params.courseId}/create-assignment`}
          className="underline text-blue-600"
        >
          + Create Assignment
        </Link>
      )}
    </div>
  );
}
