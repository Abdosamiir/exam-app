import { SidebarProvider, SidebarInset } from "@/shared/components/ui/sidebar";

export default function AdminLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <SidebarProvider style={{ "--sidebar": "#1f2937" } as React.CSSProperties}>
      {sidebar}
      <SidebarInset>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
