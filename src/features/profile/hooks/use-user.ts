"use client";

import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
  changePassword,
  requestEmailChange,
  confirmEmailChange,
  deleteAccount,
} from "../api/api.users";
import { IUpdateProfileFields, IChangePasswordFields } from "../types/user";

export function useProfile() {
  const { status } = useSession();
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    enabled: status === "authenticated",
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IUpdateProfileFields) => updateProfile(data),
    onSuccess: (res) => {
      if (res.status) {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: IChangePasswordFields) => changePassword(data),
  });
}

export function useRequestEmailChange() {
  return useMutation({
    mutationFn: (newEmail: string) => requestEmailChange(newEmail),
  });
}

export function useConfirmEmailChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => confirmEmailChange(code),
    onSuccess: (res) => {
      if (res.status) {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => deleteAccount(),
  });
}
