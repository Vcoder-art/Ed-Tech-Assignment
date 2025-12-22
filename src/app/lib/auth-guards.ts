import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Use on PROTECTED pages (dashboard)
 */
export async function requireAuth() {
  const cookie = await cookies()
  const token = cookie.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
    };
  } catch {
    redirect("/login");
  }
}

/**
 * Use on PUBLIC auth pages (login/register)
 */
export async function redirectIfAuthenticated() {
  const cookie = await cookies()
  const token = cookie.get("token")?.value;

  if (token) {
    redirect("/dashboard");
  }
}
