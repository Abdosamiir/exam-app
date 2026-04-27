"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { EllipsisVertical, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export function AdminSidebarUserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="ml-auto rounded-sm cursor-pointer p-1 hover:bg-gray-700 focus-visible:outline-none">
          <EllipsisVertical className="size-4 text-gray-300" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" className="w-44 rounded-none">
        <DropdownMenuItem asChild>
          <Link href="/admin/account" className="flex items-center gap-2 cursor-pointer">
            <UserRound className="size-4" />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/diplomas" className="flex items-center gap-2 cursor-pointer">
            <LayoutDashboard className="size-4" />
            Application
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2 text-red-500 focus:text-red-500 cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="size-4 text-red-500" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
