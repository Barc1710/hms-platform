"use client";
import * as React from "react";
import { Search, Bell, User, LogOut, ChevronDown } from "lucide-react";
import {
  Input,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@hms/ui";
import { useUser } from "@/components/providers/user-provider";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

export function DashboardNavbar() {
  const user = useUser();
  const pathname = usePathname();

  const currentRoute =
    pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard";

  const handleLogout = () => {
    Cookies.remove("hms_session");
    window.location.href = "/login";
  };

  return (
    <header className="h-24 pt-3 px-0 pr-2 shrink-0">
      {/* Contenedor con Color Secundario y Bordes Redondeados a 1.5rem */}
      <div className="h-full bg-secondary rounded-[0.75rem] flex items-center justify-between px-8 shadow-2xl shadow-primary/5 border border-primary/5">
        {/* IZQUIERDA: Ubicación */}
        <div className="flex flex-col">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-bold capitalize text-primary">
                  {currentRoute}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* CENTRO: Buscador con contraste */}
        <div className="hidden md:flex relative w-full max-w-xl mx-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary/40" />
          <Input
            placeholder="Buscar en el sistema..."
            className="w-full bg-white/60 border border-primary/40 pl-11 h-10 rounded-xl shadow-sm transition-all placeholder:text-primary/30 text-xs 
             text-primary 
             focus:bg-white 
             focus:border-primary 
             focus-visible:border-primary 
             focus-visible:ring-1 
             focus-visible:ring-primary/20 
             focus-visible:ring-offset-0 
             focus-visible:outline-none"
          />
        </div>

        {/* DERECHA: Notificaciones + Perfil (Nombre -> Avatar -> Icono) */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-xl bg-white/40 border border-primary/40 hover:bg-white transition-all text-primary/60 cursor-pointer flex items-center justify-center"
          >
            <Bell className="size-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-12 gap-3 px-2 rounded-xl bg-white/40 border border-primary/40 hover:bg-white transition-all flex items-center cursor-pointer"
              >
                {/* Nombre a la izquierda */}
                <span className="hidden lg:block text-xs font-semibold uppercase tracking-tight text-primary">
                  {user?.email.split("@")[0]}
                </span>

                {/* Avatar al centro */}
                <Avatar className="size-9 border-2 border-primary/40 shadow-sm rounded-full overflow-hidden">
                  <AvatarFallback className="bg-primary text-primary-foreground font-black text-[10px]">
                    {user?.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <ChevronDown className="size-4 text-primary/30" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-60 rounded-[1.25rem] p-2 shadow-2xl border-primary/5 bg-white"
            >
              <DropdownMenuLabel className="px-4 py-3 text-[10px] text-primary uppercase tracking-widest">
                Gestión de Cuenta
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary/10" />
              <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer font-bold text-primary/80 focus:bg-primary focus:text-secondary">
                <User className="mr-3 size-4 " /> Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary/10" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="rounded-lg py-2.5 text-primary cursor-pointer font-bold focus:bg-primary focus:text-secondary"
              >
                <LogOut className="mr-3 size-4" /> Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
