import { redirectIfAuthenticated } from "../../lib/auth-guards";
import LoginForm from "./login-form";

export default async function LoginPage() {
  await redirectIfAuthenticated(); // 🔁 logged-in → /dashboard
  return <LoginForm />;
}
