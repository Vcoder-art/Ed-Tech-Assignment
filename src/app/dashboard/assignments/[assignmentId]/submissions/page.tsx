import { prisma } from "../../../../lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export default async function AssignmentSubmissionsPage({
  params,
}: {
  params: { assignmentId: string };
}) {
  params = await params;
  const cookie = await cookies();
  const token = cookie.get("token")?.value ?? "";
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    role: "INSTRUCTOR";
  };

  if (payload.role !== "INSTRUCTOR") {
    redirect("/dashboard");
  }

  const assignment = await prisma.assignment.findUnique({
    where: { id: params.assignmentId },
    include: {
      course: true,
      submissions: {
        include: {
          student: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!assignment || assignment.course.instructorId !== payload.userId) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Submissions</h1>

      {assignment.submissions.length === 0 && (
        <p className="text-gray-500">No submissions yet.</p>
      )}

      {assignment.submissions.map((s) => (
        <div key={s.id} className="border p-4 rounded space-y-2">
          <p className="font-semibold">Student: {s.student.name}</p>
          <p className="text-sm whitespace-pre-wrap">{s.content}</p>
        </div>
      ))}
    </div>
  );
}
