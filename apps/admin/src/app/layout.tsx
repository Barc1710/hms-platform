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
        <TenantProvider data={hotelData}>
          {children}
          <Toaster position="bottom-right" />
        </TenantProvider>
      </body>
    </html>
  );
}