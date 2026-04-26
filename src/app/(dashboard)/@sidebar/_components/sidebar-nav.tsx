"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, UserRound } from "lucide-react";
import { cn } from "@/shared/lib/utils/utils";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

const navItems = [
  { href: "/diplomas", label: "Diplomas", icon: GraduationCap },
  { href: "/account", label: "Account Settings", icon: UserRound },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton asChild>
              <Link
                href={href}
                className={cn(
                  "w-full border border-blue-500 rounded-none text-base! p-4 py-6 mb-2 text-gray-500 hover:text-blue-500! hover:bg-blue-100!",
                  isActive && "text-blue-500! bg-blue-100!"
                )}
              >
                <Icon className="size-5!" />
                <span>{label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
