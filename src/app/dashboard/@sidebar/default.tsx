import Link from "next/link";

const DashboardSidebar = () => {
  return (
    <aside className="w-56 shrink-0 border-r bg-white px-4 py-6 flex flex-col gap-2">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Dashboard
      </p>
      <Link
        href="/dashboard/diplomas"
        className="rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        Diplomas
      </Link>
      <Link
        href="/dashboard/account"
        className="rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        Account Settings
      </Link>
    </aside>
  );
};

export default DashboardSidebar;
