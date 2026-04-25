import Link from "next/link";

const AdminSidebar = () => {
  return (
    <aside className="w-56 shrink-0 border-r bg-white px-4 py-6 flex flex-col gap-2">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Admin
      </p>
      <Link
        href="/admin/diplomas"
        className="rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        Diplomas
      </Link>
      <Link
        href="/admin/exams"
        className="rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        Exams
      </Link>

    </aside>
  );
};

export default AdminSidebar;
