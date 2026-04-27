"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, GraduationCap, Logs, UserRound } from "lucide-react";
import { cn } from "@/shared/lib/utils/utils";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

const navItems = [
  { href: "/admin/diplomas", label: "Diplomas", icon: GraduationCap },
  { href: "/admin/exams", label: "exams", icon: BookOpen },
  { href: "/admin/account", label: "Account Settings", icon: UserRound },
  { href: "/admin/audit-log", label: "Audit Log", icon: Logs },
];

export function AdminSidebarNav() {
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
                  "w-full border border-gray-400 rounded-none text-base! p-4 py-6 mb-2 text-gray-300 hover:text-white! hover:bg-gray-700!",
                  isActive && "text-white! bg-gray-700!",
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
