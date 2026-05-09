import { headers } from 'next/headers';

/**
 * Extrae el slug del hotel basado en el host de la petición.
 * Ejemplo: 'paraiso.localhost:3001' -> 'paraiso'
 * Ejemplo: 'miraflores.hms.app' -> 'miraflores'
 */
export async function getSlugFromHeaders(): Promise<string | null> {
  const headerList = await headers();
  const host = headerList.get('host'); // Ej: "hotel-paraiso.localhost:3001"

  if (!host) return null;

  // Lógica para desarrollo local y producción
  // Si usas subdominios (tenant.dominio.com)
  const parts = host.split('.');
  
  if (parts.length >= 2) {
    // Retorna la primera parte antes del primer punto
    return parts[0]; 
  }

  return null;
}