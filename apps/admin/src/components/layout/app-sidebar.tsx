"use client";
import * as React from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  Users,
  Warehouse,
  Wallet,
  Settings,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@hms/ui";
import { useBranding } from "@/components/providers/tenant-provider";
import { usePathname } from "next/navigation";

const navigation = [
  {
    group: "GENERAL",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Estadísticas", url: "/dashboard/stats", icon: BarChart3 },
    ],
  },
  {
    group: "OPERACIONES",
    items: [
      { title: "Reservas", url: "/dashboard/reservas", icon: CalendarCheck },
      {
        title: "Habitaciones",
        url: "/dashboard/habitaciones",
        icon: BedDouble,
      },
      { title: "Huéspedes", url: "/dashboard/huespedes", icon: Users },
    ],
  },
  {
    group: "ADMINISTRATIVO",
    items: [
      { title: "Inventario", url: "/dashboard/inventario", icon: Warehouse },
      { title: "Finanzas", url: "/dashboard/finanzas", icon: Wallet },
      { title: "Ajustes", url: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { branding } = useBranding();
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="none"
      className="border-none bg-transparent h-screen w-80 shrink-0 p-3"
    >
      {/* Tarjeta Flotante con bg-secondary y redondeado masivo */}
      <div className="h-full bg-secondary rounded-[1.25rem] flex flex-col shadow-2xl shadow-primary/5 border border-primary/5 overflow-hidden">
        <SidebarHeader className="h-32 flex items-center justify-center p-8 shrink-0">
          {branding?.url_logo ? (
            <img
              src={branding.url_logo}
              className="max-w-full max-h-full object-contain"
              alt="Logo"
            />
          ) : (
            <LayoutDashboard className="size-10 text-primary" />
          )}
        </SidebarHeader>

        <SidebarContent className="px-5 py-2 overflow-y-auto no-scrollbar">
          {navigation.map((item) => (
            <Collapsible
              key={item.group}
              defaultOpen
              className="group/collapsible mb-5"
            >
              <SidebarGroup className="p-0">
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-primary font-black text-[11px] tracking-[0.2em] hover:opacity-70 transition-all cursor-pointer">
                    {item.group}
                    <ChevronRight className="ml-auto size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent className="pt-2">
                    <SidebarMenu className="gap-1.5">
                      {item.items.map((subItem) => {
                        const isActive = pathname === subItem.url;
                        return (
                          <SidebarMenuItem key={subItem.title}>
                            <SidebarMenuButton
                              asChild
                              className={`h-11 rounded-[1.25rem] transition-all duration-200 px-5 ${
                                isActive
                                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold scale-[1.02]"
                                  : "text-primary hover:bg-primary/10 font-semibold"
                              }`}
                            >
                              <a href={subItem.url}>
                                <subItem.icon
                                  className={`size-5 ${isActive ? "scale-110" : ""}`}
                                />
                                <span className="ml-3 text-sm">
                                  {subItem.title}
                                </span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))}
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
