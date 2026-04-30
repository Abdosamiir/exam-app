"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { signOut } from "next-auth/react";

import { Field, FieldLabel, FieldError } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/shared/components/ui/dialog";

import {
  useProfile,
  useUpdateProfile,
  useDeleteAccount,
} from "../../hooks/use-user";
import {
  updateProfileSchema,
  UpdateProfileSchema,
} from "../../schemas/user.schema";
import ChangeEmailSection from "./change-email-section";

const ProfileForm = () => {
  const { data: profileData, isLoading } = useProfile();
  const user = profileData?.status ? profileData.payload?.user : undefined;

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const form = useForm<UpdateProfileSchema>({
    defaultValues: { firstName: "", lastName: "", phone: "" },
    resolver: async (values) => {
      const result = updateProfileSchema.safeParse(values);
      if (result.success) return { values: result.data, errors: {} };
      return {
        values: {},
        errors: result.error.issues.reduce<
          Record<string, { message: string; type: string }>
        >((acc, issue) => {
          const key = String(issue.path[0]);
          acc[key] = { message: issue.message, type: issue.code };
          return acc;
        }, {}),
      };
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: deleteAccount, isPending: isDeletingAccount } =
    useDeleteAccount();

  const onSave = (data: UpdateProfileSchema) => {
    setFormError(null);
    setFormSuccess(null);
    updateProfile(data, {
      onSuccess: (res) => {
        if (!res.status) {
          setFormError(res.message ?? "Failed to save changes.");
          return;
        }
        setFormSuccess("Profile updated successfully.");
      },
      onError: () => setFormError("Something went wrong."),
    });
  };

  const onDeleteAccount = () => {
    deleteAccount(undefined, {
      onSuccess: (res) => {
        if (!res.status) {
          setDeleteConfirm(false);
          return;
        }
        signOut({ callbackUrl: "/login" });
      },
      onError: () => setDeleteConfirm(false),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-500">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="w-full max-w-full space-y-6 bg-white p-4 sm:p-5">
      <form
        id="profile-form"
        onSubmit={form.handleSubmit(onSave)}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="First name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Last name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            value={user?.username ?? ""}
            readOnly
            className="cursor-not-allowed bg-gray-100 opacity-60"
          />
        </Field>

        {/* Email section — its own independent forms, never nested inside profile-form */}
        <ChangeEmailSection currentEmail={user?.email ?? ""} />

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="tel"
                aria-invalid={fieldState.invalid}
                placeholder="Phone number"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}
      {formSuccess && (
        <p role="status" className="text-sm text-green-600">
          {formSuccess}
        </p>
      )}

      {/* Buttons are outside <form> and linked to it via the form attribute */}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Button
          type="button"
          variant="destructive"
          className="w-full rounded-none bg-red-50 py-5 text-red-500 hover:text-white sm:flex-1"
          onClick={() => setDeleteConfirm(true)}
        >
          Delete my account
        </Button>

        <Button
          type="submit"
          form="profile-form"
          disabled={isUpdating}
          className="w-full rounded-none bg-blue-600 px-6 py-5 text-white hover:bg-blue-700 sm:flex-1"
        >
          {isUpdating ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <Dialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-none p-4 text-center sm:p-5"
        >
          <button
            onClick={() => setDeleteConfirm(false)}
            className="absolute right-4 top-4 z-20 rounded opacity-70 hover:opacity-100"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
            </svg>
            <span className="sr-only">Close</span>
          </button>

          <div className="flex flex-col items-center gap-3 px-4 pt-10 pb-6 sm:px-8">
            <div className="flex items-center justify-center size-20 rounded-full bg-red-50">
              <div className="flex items-center justify-center size-14 rounded-full bg-red-100">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-bold text-red-600 leading-snug ">
              Are you sure you want to delete your account?
            </h2>
            <p className="text-sm text-gray-500">
              This action is permanent and cannot be undone.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 border-t pt-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setDeleteConfirm(false)}
              className="py-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors sm:border-r"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeletingAccount}
              onClick={onDeleteAccount}
              className="py-4 text-sm font-medium text-white bg-red-600 hover:bg-red-600 transition-colors disabled:opacity-60"
            >
              {isDeletingAccount ? "Deleting…" : "Yes, delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileForm;
