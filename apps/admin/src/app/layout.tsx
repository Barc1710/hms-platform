import { TenantProvider } from "@/components/providers/tenant-provider";
import { Toaster } from 'sonner';
import { getHotelBranding } from "@/lib/api-tenant";
import { getSlugFromHeaders } from "@/lib/tenant-utils"; // Importar utilidad
import "./globals.css";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 1. Detectamos el slug automáticamente desde la URL
  const slug = await getSlugFromHeaders();
  
  // 2. Buscamos los datos en el Backend usando ese slug
  const hotelData = slug ? await getHotelBranding(slug) : null;

  return (
    <html lang="es">
      <body className="antialiased">
        {hotelData ? (
          <TenantProvider data={hotelData}>
             {children}
            <Toaster position="bottom-right" />
          </TenantProvider>
        ) : (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white p-10 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-2">Acceso no autorizado</h1>
            <p className="text-zinc-400">No hemos podido identificar el hotel basado en la URL: <strong>{slug || 'desconocida'}</strong></p>
            <p className="mt-4 text-xs text-zinc-600">Asegúrate de entrar vía [hotel-slug].localhost:3001</p>
          </div>
        )}
      </body>
    </html>
  );
}