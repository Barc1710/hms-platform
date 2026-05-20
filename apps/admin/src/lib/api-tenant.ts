export async function getHotelBranding(slug: string) {
  try {
    // IMPORTANTE: Asegúrate que la URL apunte a tu API de NestJS
    const res = await fetch(`http://localhost:3000/tenant-test/debug`, {
      headers: {
        'x-tenant-slug': slug, // Enviamos el slug detectado al Backend
      },
      cache: 'no-store', // Vital para ver cambios de DB en tiempo real
    });

    if (!res.ok) {
      console.warn(`⚠️ Hotel con slug "${slug}" no encontrado en el API.`);
      return null;
    }

    const data = await res.json();
    return data.data_en_request;
  } catch (error) {
    console.error("❌ Fallo crítico al conectar con el API:", error);
    return null;
  }
}