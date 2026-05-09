"use client";

export const useTenant = (): string => {
  if (typeof window === "undefined") return "default";

  const hostname = window.location.hostname;
  
  // Si entras a hotel-paraiso.localhost:3001, esto captura "hotel-paraiso"
  // Si entras a gran-cumbaza.localhost:3001, captura "gran-cumbaza"
  const parts = hostname.split('.');
  
  if (parts.length > 1 && parts[0]) {
    return parts[0]; 
  }

  return "default";
};