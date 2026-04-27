export default function AccountLayout({
  children,
  accountsidebar,
}: {
  children: React.ReactNode;
  accountsidebar: React.ReactNode;
}) {
  return (
    <div className="flex h-full bg-gray-50">
      {accountsidebar}
      <main className="flex-1 px-4">{children}</main>
    </div>
  );
}
