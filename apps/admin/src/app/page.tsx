import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function RootPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("hms_session");

  // Si no hay sesión, mandamos al login del hotel
  if (!session) {
    redirect("/login");
  }

  // Si hay sesión, mandamos directo al panel
  redirect("/dashboard");
}