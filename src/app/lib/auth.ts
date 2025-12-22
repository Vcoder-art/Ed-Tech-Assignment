import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies(); // Await the cookies() function

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies(); // Await the cookies() function
  cookieStore.delete("token");
}


export async function getAuthUser() {
  const token =  (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };
  } catch {
    return null;
  }
}
