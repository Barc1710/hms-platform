'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { hexToHslComponents } from '@/lib/utils-colors';

interface Branding {
  color_primario: string;
  color_secundario: string;
  url_logo: string;
}

interface TenantData {
  nombre?: string | null;
  slug?: string | null;
  branding?: Branding | null;
}

interface TenantContextProps {
  branding: Branding | null;
  hotelName: string;
  slug: string;
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

export function TenantProvider({ 
  data, 
  children 
}: { 
  data: TenantData | null;
  children: React.ReactNode 
}) {
  useEffect(() => {
    if (data?.branding?.color_primario) {
      const root = document.documentElement;
      const primaryHsl = hexToHslComponents(data.branding.color_primario);
      const secondaryHsl = hexToHslComponents(data.branding.color_secundario || data.branding.color_primario);

      root.style.setProperty('--primary', primaryHsl);
      root.style.setProperty('--secondary', secondaryHsl);
      root.style.setProperty('--primary-foreground', '0 0% 100%');
    }
  }, [data]);

  return (
    <TenantContext.Provider value={{ 
      branding: data?.branding ?? null, 
      hotelName: data?.nombre || 'HMS',
      slug: data?.slug || 'default'
    }}>
      {children}
    </TenantContext.Provider>
  );
}

// Hook para usar el branding en cualquier parte
export const useBranding = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error("useBranding debe usarse dentro de un TenantProvider");
  return context;
};