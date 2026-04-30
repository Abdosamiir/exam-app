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
import { USER_ROLES } from "@/features/auth/constants/user.constant";

type Props = {
  role: string;
};

const adminRoles = [USER_ROLES.admin, USER_ROLES.superAdmin] as string[];

export function SidebarUserMenu({ role }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="ml-auto rounded-sm cursor-pointer p-1 hover:bg-accent focus-visible:outline-none">
          <EllipsisVertical className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" className="w-44 rounded-none">
        <DropdownMenuItem asChild>
          <Link href="/account" className="flex items-center gap-2 cursor-pointer">
            <UserRound className="size-4" />
            Account
          </Link>
        </DropdownMenuItem>
        {adminRoles.includes(role) && (
          <DropdownMenuItem asChild>
            <Link href="/admin/diplomas" className="flex items-center gap-2 cursor-pointer">
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        )}
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
