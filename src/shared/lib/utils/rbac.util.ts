
import { USER_ROLES } from "@/features/auth/constants/user.constant";
import { TRole } from "@/features/auth/types/user";

const POLICIES = {
  [USER_ROLES.owner]: [
    "view:products",
    "create:products",
    "update:products",
    "delete:products",
    "view:categories",
    "create:categories",
    "update:categories",
    "delete:categories",
  ],
  [USER_ROLES.admin]: [
    "view:products",
    "create:products",
    "update:products",
    "view:categories",
    "create:categories",
    "update:categories",
  ],
  [USER_ROLES.user]: [
    // "view:products",
    "view:categories",
  ],
} as const;

type PolicyRole = keyof typeof POLICIES;
type Permission = (typeof POLICIES)[PolicyRole][number];

export function hasPermission(permission: Permission, role?: TRole) {
  if (!role || !(role in POLICIES)) return false;

  return (POLICIES[role as PolicyRole] as readonly Permission[]).includes(permission);
}
