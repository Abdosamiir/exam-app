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
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(session!.accessToken),
    enabled: !!session?.accessToken,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  return useMutation({
    mutationFn: (data: IUpdateProfileFields) =>
      updateProfile(data, session!.accessToken),
    onSuccess: (res) => {
      if (res.status) {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    },
  });
}

export function useChangePassword() {
  const { data: session } = useSession();
  return useMutation({
    mutationFn: (data: IChangePasswordFields) =>
      changePassword(data, session!.accessToken),
  });
}

export function useRequestEmailChange() {
  const { data: session } = useSession();
  return useMutation({
    mutationFn: (newEmail: string) =>
      requestEmailChange(newEmail, session!.accessToken),
  });
}

export function useConfirmEmailChange() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  return useMutation({
    mutationFn: (code: string) =>
      confirmEmailChange(code, session!.accessToken),
    onSuccess: (res) => {
      if (res.status) {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    },
  });
}

export function useDeleteAccount() {
  const { data: session } = useSession();
  return useMutation({
    mutationFn: () => deleteAccount(session!.accessToken),
  });
}
