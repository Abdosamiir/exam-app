import Image from "next/image";
import { getServerSession } from "next-auth";
import { FolderCode } from "lucide-react";
import finalLogo from "../../../../public/final-logo.png";
import { authOptions } from "@/shared/lib/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/shared/components/ui/sidebar";
import { SidebarNav } from "./_components/sidebar-nav";


const DashboardSidebar = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Image src={finalLogo} alt="Final Logo" priority className="w-30" />
        <div className="flex items-center text-primary gap-2.5 text-lg font-bold tracking-tight">
          <FolderCode className="h-6 w-6" />
          Exam App
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNav />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {user && (
        <SidebarFooter className="p-4">
          <div className="flex  items-center gap-1.5">
            {user.profilePhoto ? (
              <Image
                src={user.profilePhoto}
                alt={user.firstName}
                width={48}
                height={48}
                className="rounded-none border border-blue-500 object-cover"
              />
            ) : (
              <div className="size-12 rounded-none bg-primary flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
            )}
            <div className="flex flex-col items-start justify-start">
              <span className="text-sm font-medium  truncate w-full text-blue-600">
                {user.firstName}
              </span>
              <span className="text-xs text-muted-foreground truncate w-full text-center">
                {user.email}
              </span>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default DashboardSidebar;
