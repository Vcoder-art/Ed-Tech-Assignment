import { prisma } from "../../lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  searchParams = await searchParams;
  const cookieStore = await cookies(); // ✅ FIX

  const token = cookieStore.get("token")?.value ?? "";

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    role: "STUDENT" | "INSTRUCTOR";
  };

  const courses = await prisma.course.findMany({
    where:
      payload.role === "INSTRUCTOR"
        ? { instructorId: payload.userId }
        : { isPublished: true },

    include: {
      enrollments: {
        select: {
          userId: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Courses</h1>

        {/* INSTRUCTOR QUICK ACTION */}
        {payload.role === "INSTRUCTOR" && (
          <Link
            href="/dashboard/courses/create"
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            + Create Course
          </Link>
        )}
      </div>

      {searchParams?.status === "published" && (
        <div className="bg-green-100 text-green-800 p-3 rounded">
          ✅ Course published successfully.
        </div>
      )}

      {searchParams?.status === "unpublished" && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded">
          ⚠️ Course unpublished.
        </div>
      )}

      {/* EMPTY STATE */}
      {courses.length === 0 && (
        <p className="text-gray-500">
          {payload.role === "INSTRUCTOR"
            ? "You haven’t created any courses yet."
            : "No courses available right now."}
        </p>
      )}

      {/* COURSES LIST */}
      {courses.map((course: any) => {
        const isEnrolled =
          payload.role === "STUDENT"
            ? course.enrollments.some((e: any) => e.userId === payload.userId)
            : false;

        return (
          <div
            key={course.id}
            className="border p-4 rounded space-y-2 hover:bg-gray-50 transition"
          >
            {/* TITLE + STATUS */}
            <div className="flex items-center gap-3">
              <h3 className="font-semibold">{course.title}</h3>

              {/* INSTRUCTOR STATUS BADGE */}
              {payload.role === "INSTRUCTOR" && (
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    course.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {course.isPublished ? "Published" : "Draft"}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500">{course.description}</p>

            {/* ACTIONS */}
            <div className="flex gap-4 text-sm">
              {/* INSTRUCTOR ACTIONS */}
              {payload.role === "INSTRUCTOR" && (
                <>
                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className="text-blue-600 underline"
                  >
                    View Assignments
                  </Link>

                  <Link
                    href={`/dashboard/courses/${course.id}/create-assignment`}
                    className="text-green-600 underline"
                  >
                    + Create Assignment
                  </Link>

                  {/* PUBLISH / UNPUBLISH */}
                  <form
                    action={`/api/courses/${course.id}/publish`}
                    method="post"
                  >
                    <button
                      className={`underline ${
                        course.isPublished ? "text-red-600" : "text-purple-600"
                      }`}
                    >
                      {course.isPublished ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                </>
              )}

              {/* STUDENT ACTIONS */}
              {payload.role === "STUDENT" &&
                (isEnrolled ? (
                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className="text-blue-600 underline"
                  >
                    View Assignments
                  </Link>
                ) : (
                  <form
                    action={`/api/courses/${course.id}/enroll`}
                    method="post"
                  >
                    <button className="text-green-600 underline">Enroll</button>
                  </form>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
