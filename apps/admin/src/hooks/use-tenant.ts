"use client";
export const useTenant = () => {
  if (typeof window === "undefined") return "default";

  const hostname = window.location.hostname;

  // Si estamos en localhost, devolvemos el slug que insertamos en el SEED SQL
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "hotel-paraiso"; 
  }

  return hostname.split('.')[0];
};