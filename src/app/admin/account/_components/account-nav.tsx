"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, Lock } from "lucide-react";
import { cn } from "@/shared/lib/utils/utils";

const navItems = [
  { href: "/admin/account/profile", label: "Profile", icon: CircleUserRound },
  { href: "/admin/account/change-password", label: "Change Password", icon: Lock },
];

export function AdminAccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium border border-gray-300 text-gray-500 hover:text-white hover:bg-gray-700 transition-colors",
              isActive && "text-white bg-gray-700 border-gray-600",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
