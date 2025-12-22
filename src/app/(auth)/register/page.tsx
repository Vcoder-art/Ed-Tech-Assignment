import { redirectIfAuthenticated } from "../../lib/auth-guards";
import RegisterForm from "./register-page";

export default async function RegisterPage() {
  await redirectIfAuthenticated(); // 🔁 logged-in → /dashboard
  return <RegisterForm />;
}