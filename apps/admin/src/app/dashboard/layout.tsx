import {
  SidebarProvider,
  SidebarInset,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@hms/ui";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { UserProvider } from "@/components/providers/user-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <SidebarProvider defaultOpen={true}>
        {/* FONO GLOBAL: Aquí aplicamos el tinte sutil del 3% para TODA la pantalla */}
        <div className="flex h-screen w-full overflow-hidden bg-primary/[0.5] font-sans text-foreground">
          <AppSidebar />

          {/* SidebarInset ahora es transparente para dejar ver el fondo de arriba */}
          <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-transparent transition-all duration-300">
            <header className="flex h-16 shrink-0 items-center justify-between px-8 bg-transparent">
              <div className="flex items-center gap-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/25">
                        Property Management System
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Status Live */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest opacity-60">
                  Sistema Activo
                </span>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 lg:p-8 no-scrollbar">
              <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {children}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </UserProvider>
  );
}
