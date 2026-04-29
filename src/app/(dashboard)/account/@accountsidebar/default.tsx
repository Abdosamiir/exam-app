"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Lock, PanelLeft, CircleUserRound, LogOut } from "lucide-react";
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
          "flex shrink-0 flex-row border-b bg-white transition-all duration-300 ease-in-out md:flex-col md:border-b-0 md:border-r",
          collapsed ? "md:w-14" : "md:w-56",
        )}
      >
        <div className="hidden items-center border-b px-2 py-2 md:flex">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PanelLeft className="size-4" />
          </button>
        </div>

        <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto px-2 py-2 md:flex-col md:overflow-visible md:py-6">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");

            const linkEl = (
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-none px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-blue-100! hover:text-blue-500! sm:gap-3",
                  collapsed && "md:justify-center md:px-2",
                  isActive && "text-blue-500 bg-blue-50",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className={cn(collapsed && "md:hidden")}>{label}</span>
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                  <TooltipContent side="right" className="hidden md:block">
                    {label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={href}>{linkEl}</div>;
          })}
        </nav>

        <div className="border-l px-2 py-2 md:border-l-0 md:border-t md:py-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className={cn(
                  "flex w-full items-center gap-2 whitespace-nowrap rounded-none bg-red-50 px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:cursor-pointer hover:bg-red-100 sm:gap-3",
                  collapsed && "md:justify-center md:px-2",
                )}
              >
                <LogOut className="size-4 shrink-0 rotate-180" />
                <span
                  className={cn("hidden md:block", collapsed && "md:hidden")}
                >
                  Log out
                </span>
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="hidden md:block">
                Log out
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default AccountSidebar;
