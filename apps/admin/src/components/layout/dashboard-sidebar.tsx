"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useBranding } from "@/components/providers/tenant-provider";
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Reservas", href: "/dashboard/reservas", icon: CalendarDays },
  { name: "Habitaciones", href: "/dashboard/habitaciones", icon: BedDouble },
  { name: "Huéspedes", href: "/dashboard/huespedes", icon: Users },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { hotelName, branding } = useBranding();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("hms_session");
    router.push("/login");
  };

  return (
    <aside className="w-64 border-r border-primary/10 flex flex-col bg-white h-screen sticky top-0">
      {/* Header de Sidebar con Logo Dinámico */}
      <div className="p-6 border-b border-primary/5">
        <div className="flex items-center gap-3">
          {branding?.url_logo ? (
            <img
              src={branding.url_logo}
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
          ) : (
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              {hotelName?.[0] ?? "H"}
            </div>
          )}
          <span className="font-bold text-primary truncate text-sm uppercase tracking-wider">
            {hotelName}
          </span>
        </div>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = !!pathname && (pathname === item.href || pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-primary/60 hover:bg-secondary hover:text-primary",
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive
                      ? ""
                      : "group-hover:scale-110 transition-transform",
                  )}
                />
                {item.name}
              </div>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer de Sidebar / Usuario */}
      <div className="p-4 mt-auto border-t border-primary/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
