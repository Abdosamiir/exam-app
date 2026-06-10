import { SidebarProvider, SidebarInset } from "@/shared/components/ui/sidebar";
import { DashboardBreadcrumb } from "../_components/shared/dashboard-breadcrumb";
import { PageHeader } from "../_components/shared/page-header";

export default function DashboardLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar": "color-mix(in oklab, var(--primary) 5%, white)",
        } as React.CSSProperties
      }
    >
      {sidebar}
      <SidebarInset>
        <DashboardBreadcrumb />
        <PageHeader />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
