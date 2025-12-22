import type { ReactNode } from "react";
import Link from "next/link";
import { requireAuth } from "../lib/auth-guards";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // requireAuth should handle the redirect internally if the token is missing
  const user = await requireAuth(); 

  const navStyles = "block p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700 font-medium";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed: Added 'flex flex-col' to ensure spacing works and fixed positioning if needed */}
      <aside className="w-64 bg-white border-r px-6 py-8 flex flex-col">
        <h2 className="text-xl font-bold mb-8 text-blue-600">EdTech Dashboard</h2>

        <nav className="space-y-2 flex-1">
          <Link href="/dashboard" className={navStyles}>
            Dashboard
          </Link>

          {user.role === "INSTRUCTOR" && (
            <>
              <Link href="/dashboard/courses" className={navStyles}>
                My Courses
              </Link>
              <Link href="/dashboard/assignments" className={navStyles}>
                Assignments
              </Link>
              <Link href="/dashboard/submissions" className={navStyles}>
                Submissions
              </Link>
            </>
          )}
        </nav>

        {/* Improved: Styled the logout button and ensured it sits at the bottom */}
        <div className="border-t pt-6">
          <form action="/api/auth/logout" method="post">
            <button className="w-full text-left text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors">
              Logout
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-8 bg-white m-4 rounded-xl shadow-sm border">
        {children}
      </main>
    </div>
  );
}