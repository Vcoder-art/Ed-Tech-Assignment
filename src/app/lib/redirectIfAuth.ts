import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function redirectIfAuth() {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  if (token) {
    redirect("/dashboard");
  }
}
