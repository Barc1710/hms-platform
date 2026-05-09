import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSlugFromHeaders } from "@/lib/tenant-utils";
import { getHotelBranding } from "@/lib/api-tenant";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

// Función para decodificar el JWT sin necesidad de librería pesada (solo lectura)
function parseJwt(token: string) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch (e) {
    return null;
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("hms_session");
  const slug = await getSlugFromHeaders();

  // 1. Si no hay sesión, al login
  if (!session) redirect("/login");

  // 2. Decodificamos el token para ver a qué hotel pertenece
  const payload = parseJwt(session.value);
  
  // 3. Obtenemos el hotel actual de la URL
  const hotelData = await getHotelBranding(slug!);

  // 4. VALIDACIÓN CRUZADA:
  // Si el ID del hotel en el token NO coincide con el ID del hotel en la URL...
  if (payload?.hotelId !== hotelData?.id) {
    // Forzamos el cierre de sesión porque está intentando entrar a otro hotel
    // (En un paso siguiente limpiaremos la cookie, por ahora redirigimos)
    redirect("/login"); 
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 bg-zinc-50/50">
        {children}
      </main>
    </div>
  );
}