import Image from "next/image";
import { getServerSession } from "next-auth";
import { FolderCode } from "lucide-react";
import finalLogoWhite from "../../../../public/final-logo-white.png";
import { authOptions } from "@/shared/lib/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/shared/components/ui/sidebar";
import { AdminSidebarNav } from "./_components/sidebar-nav";
import { AdminSidebarUserMenu } from "./_components/sidebar-user-menu";

const AdminSidebar = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <Sidebar>
      <SidebarHeader className="p-4 bg-gray-800">
        <Image src={finalLogoWhite} alt="Final Logo" priority className="w-30 fill-white" />
        <div className="flex items-center text-white gap-2.5 text-lg font-bold tracking-tight">
          <FolderCode className="h-6 w-6" />
          Exam App
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 bg-gray-800">
        <SidebarGroup>
          <SidebarGroupContent>
            <AdminSidebarNav />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {user && (
        <SidebarFooter className="p-4 bg-gray-800">
          <div className="flex items-center gap-1.5">
            {user.profilePhoto ? (
              <Image
                src={user.profilePhoto}
                alt={user.firstName}
                width={48}
                height={48}
                className="rounded-none border border-gray-400 object-cover"
              />
            ) : (
              <div className="size-12 rounded-none bg-gray-700 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
            )}
            <div className="flex min-w-0 flex-col items-start justify-start">
              <span className="w-full truncate text-sm font-medium text-white">
                {user.firstName}
              </span>
              <span className="w-full truncate text-wrap text-xs text-gray-400">
                {user.email}
              </span>
            </div>
            <AdminSidebarUserMenu />
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default AdminSidebar;
