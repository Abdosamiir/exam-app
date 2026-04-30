
import { USER_ROLES } from "@/features/auth/constants/user.constant";
import { TRole } from "@/features/auth/types/user";

const POLICIES = {
  [USER_ROLES.superAdmin]: [
    "view:diplomas",
    "create:diplomas",
    "update:diplomas",
    "delete:diplomas",
    "toggle-immutable:diplomas",
    "view:exams",
    "create:exams",
    "update:exams",
    "delete:exams",
    "toggle-immutable:exams",
    "view:audit-logs",
    "delete:audit-logs",
  ],
  [USER_ROLES.owner]: [
    "view:diplomas",
    "create:diplomas",
    "update:diplomas",
    "delete:diplomas",
    "view:exams",
    "create:exams",
    "update:exams",
    "delete:exams",
    "view:audit-logs",
    "delete:audit-logs",
  ],
  [USER_ROLES.admin]: [
    "view:diplomas",
    "create:diplomas",
    "update:diplomas",
    "view:exams",
    "create:exams",
    "update:exams",
    "view:audit-logs",
  ],
  [USER_ROLES.user]: [
    "view:diplomas",
    "view:exams",
  ],
} as const;

type PolicyRole = keyof typeof POLICIES;
type Permission = (typeof POLICIES)[PolicyRole][number];

export function hasPermission(permission: Permission, role?: TRole) {
  if (!role || !(role in POLICIES)) return false;

  return (POLICIES[role as PolicyRole] as readonly Permission[]).includes(permission);
}
