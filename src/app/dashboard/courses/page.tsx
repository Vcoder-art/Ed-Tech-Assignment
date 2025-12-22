import { prisma } from "../../lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default async function CoursesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";
  

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    role: "INSTRUCTOR" | "STUDENT";
  };

  const courses = await prisma.course.findMany({
    where: { instructorId: payload.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Courses</h1>

      <div className="grid gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-500">
                {course.description}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-4">
                {/* View assignments – everyone */}
                <Link
                  href={`/dashboard/courses/${course.id}`}
                  className="text-sm text-blue-600 underline"
                >
                  View Assignments
                </Link>

                {/* Create assignment – ONLY INSTRUCTOR */}
                {payload.role === "INSTRUCTOR" && (
                  <Link
                    href={`/dashboard/courses/${course.id}/create-assignment`}
                    className="text-sm text-green-600 underline"
                  >
                    + Create Assignment
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
