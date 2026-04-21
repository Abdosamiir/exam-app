import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col gap-3 max-w-md">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Name</span>
          <span className="font-medium">
            {session?.user.firstName} {session?.user.lastName}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Username</span>
          <span className="font-medium">{session?.user.username}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Email</span>
          <span className="font-medium">{session?.user.email}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Role</span>
          <span className="font-medium capitalize">{session?.user.role.toLowerCase()}</span>
        </div>
      </div>
    </div>
  );
}
