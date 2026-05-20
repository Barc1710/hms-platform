"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  rol: string;
  hotelId: string;
}

const UserContext = createContext<User | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const session = Cookies.get("hms_session");
    if (session) {
      try {
        const payload = JSON.parse(atob(session.split(".")[1]));
        setUser(payload);
      } catch (e) {
        console.error("❌ Error decodificando JWT:", e);
      }
    }
  }, [isMounted]);

  if (!isMounted) {
    return <div className="invisible">{children}</div>;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
