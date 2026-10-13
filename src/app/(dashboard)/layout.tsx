import { cookies } from "next/headers"; // -> cookies sangte ki sidebar open ahe ki close ahe with the help of sidebar_state
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"; // -> sidebarInsert means the main content rather than the sidebar
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen} className="h-svh">
        <DashboardSidebar />
        <SidebarInset className="min-h-0 min-w-0">
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
