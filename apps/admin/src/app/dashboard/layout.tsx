import { SidebarProvider, SidebarInset } from "@hms/ui";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { UserProvider } from "@/components/providers/user-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full overflow-hidden bg-primary/[0.5] font-sans text-foreground">
          <AppSidebar />

          <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-transparent transition-all duration-300">
            <DashboardNavbar />

            
            <main className="flex-1 overflow-y-auto p-2 no-scrollbar">
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
