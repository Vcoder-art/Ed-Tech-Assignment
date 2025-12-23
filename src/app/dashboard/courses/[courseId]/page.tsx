import { requireAuth } from "../../../lib/auth-guards";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";

export default async function CourseAssignmentsPage({
  params,
}: {
  params: { courseId: string };
}) {
  params = await params;
  requireAuth();
  const cookie = await cookies();
  const token = cookie.get("token")?.value ?? "";
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    role: "STUDENT" | "INSTRUCTOR";
  };

  const res = await fetch(`/api/courses/${params.courseId}/assignments`, {
    cache: "no-store",
  });

  const assignments = await res.json();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Assignments</h1>

      {assignments.length === 0 && <p>No assignments</p>}

      {assignments.map((a: any) => (
        <div key={a.id} className="border p-3 rounded space-y-2">
          <h3 className="font-semibold">{a.title}</h3>
          <p className="text-sm text-gray-500">{a.description}</p>

          {/* STUDENT → SUBMIT */}
          {payload.role === "STUDENT" && (
            <Link
              href={`/dashboard/assignments/${a.id}/submit`}
              className="text-blue-600 underline text-sm"
            >
              Submit Assignment
            </Link>
          )}

          {/* INSTRUCTOR → VIEW SUBMISSIONS */}
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

      {/* ONLY INSTRUCTOR CAN CREATE */}
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
