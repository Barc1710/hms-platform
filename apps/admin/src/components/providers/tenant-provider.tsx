"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { hexToHslComponents } from "@/lib/utils-colors";

interface Branding {
  color_primario?: string;
  color_secundario?: string;
  url_logo?: string;
}

interface TenantProviderProps {
  branding?: Branding | null;
  children: ReactNode;
}

export function TenantProvider({
  branding,
  children,
}: TenantProviderProps) {
  useEffect(() => {
    if (!branding?.color_primario) {
      return;
    }

    const root = document.documentElement;

    try {
      // Convert to: "222 47% 11%"
      const primaryHsl = hexToHslComponents(branding.color_primario);
      const secondaryHsl = hexToHslComponents(
        branding.color_secundario || branding.color_primario,
      );

      root.style.setProperty("--primary", primaryHsl);
      root.style.setProperty("--secondary", secondaryHsl);
    } catch {
      // Ignore invalid branding colors and keep current theme variables.
    }
  }, [branding]);

  return <>{children}</>;
}
