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
    <SidebarProvider style={{ "--sidebar": "var(--color-blue-50)" } as React.CSSProperties}>
      {sidebar}
      <SidebarInset>
        <DashboardBreadcrumb />
        <PageHeader />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
