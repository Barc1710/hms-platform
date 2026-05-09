import { TenantProvider } from "@/components/providers/tenant-provider";
import { getHotelBranding } from "@/lib/api-tenant";
import "./globals.css";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Obtenemos los datos del API
  const hotelData = await getHotelBranding('hotel-paraiso');

  return (
    <html lang="es">
      <body className="antialiased">
        {hotelData ? (
          <TenantProvider branding={hotelData.branding}>
            {children}
          </TenantProvider>
        ) : (
          <div className="h-screen flex items-center justify-center">
            Conectando con el motor multi-tenant...
          </div>
        )}
      </body>
    </html>
  );
}