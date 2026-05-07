"use client";

import { useMemo } from "react";

export const useTenant = () => {
  return useMemo(() => {
    if (typeof window === "undefined") return "default";
    const hostname = window.location.hostname;
    const slug = hostname.split('.')[0];
    return slug || "hotel-paraiso";
  }, []);
};
