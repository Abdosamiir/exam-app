import { AdminAccountNav } from "./_components/account-nav";

export default function AdminAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6 h-full">
      <aside className="w-52 shrink-0">
        <AdminAccountNav />
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
