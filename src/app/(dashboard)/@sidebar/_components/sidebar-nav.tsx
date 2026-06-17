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
                  "w-full  rounded-none text-base! p-4 py-6 mb-2 text-gray-500 hover:text-primary! hover:bg-primary/10!",
                  isActive && "border border-primary text-primary! bg-primary/10!"
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
