"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { User, Lock, PanelLeft, CircleUserRound, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/shared/lib/utils/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

const navItems = [
  { href: "/account/profile", label: "Profile", icon: CircleUserRound },
  { href: "/account/change-password", label: "Change Password", icon: Lock },
];

const AccountSidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "shrink-0 border-r bg-white flex flex-col transition-all duration-300 ease-in-out",
          collapsed ? "w-14" : "w-56",
        )}
      >
        <div className="flex items-center border-b px-2 py-2">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PanelLeft className="size-4" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-6 flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");

            const linkEl = (
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-none px-3 py-2 text-sm font-medium text-gray-500 hover:text-blue-500! hover:bg-blue-100! transition-colors",
                  collapsed && "justify-center px-2 ",
                  isActive && "text-blue-500 bg-blue-50",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              );
            }

            return <div key={href}>{linkEl}</div>;
          })}
        </nav>

        <div className="border-t px-2 py-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className={cn(
                  "flex w-full items-center gap-3 rounded-none px-3 py-2 text-sm font-medium  bg-red-50 text-red-500 transition-colors hover:cursor-pointer hover:bg-red-100",
                  collapsed && "justify-center px-2",
                )}
              >
                <LogOut className="size-4 shrink-0 rotate-180" />
                {!collapsed && <span>Log out</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Log out</TooltipContent>}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default AccountSidebar;
