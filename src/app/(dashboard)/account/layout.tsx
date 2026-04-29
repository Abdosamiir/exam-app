export default function AccountLayout({
  children,
  accountsidebar,
}: {
  children: React.ReactNode;
  accountsidebar: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-gray-50 md:flex-row">
      {accountsidebar}
      <main className="min-w-0 flex-1 pt-4 md:px-4 md:pt-0">{children}</main>
    </div>
  );
}
