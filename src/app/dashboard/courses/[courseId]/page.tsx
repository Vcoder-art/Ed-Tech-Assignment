import { requireAuth } from "../../../lib/auth-guards";
import { use } from "react";

export default async function CourseAssignmentsPage({
  params,
}: {
  params: { courseId: string };
}) {
  requireAuth();

  params = await params;
  
  const res = await fetch(
    `http://localhost:3000/api/courses/${params.courseId}/assignments`,
    { cache: "no-store" }
  );

  const assignments = await res.json();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Assignments</h1>

      {assignments.length === 0 && <p>No assignments</p>}

      {assignments.map((a: any) => (
        <div key={a.id} className="border p-3 rounded">
          <h3>{a.title}</h3>
          <p>{a.description}</p>
        </div>
      ))}

      <a
        href={`/dashboard/courses/${params.courseId}/create-assignment`}
        className="underline text-blue-600"
      >
        + Create Assignment
      </a>
    </div>
  );
}
