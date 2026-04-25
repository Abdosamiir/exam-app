"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { signOut } from "next-auth/react";

import {
  Field,
  FieldLabel,
  FieldError,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

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
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information.
        </p>
      </div>

      {/*
        The profile <form> wraps only the fields sent to PATCH /users/profile.
        Username is readonly (not submitted). Email has its own flow via
        ChangeEmailSection which renders its own independent forms after this
        one — avoiding nested <form> elements entirely.
        The Save button is outside this form and linked via form="profile-form".
      */}
      <form
        id="profile-form"
        onSubmit={form.handleSubmit(onSave)}
        className="space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
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
            className="cursor-not-allowed opacity-60"
          />
        </Field>

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
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </form>

      {/* Email section — its own independent forms, never nested inside profile-form */}
      <ChangeEmailSection currentEmail={user?.email ?? ""} />

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
      <div className="flex items-center justify-between pt-2">
        {!deleteConfirm ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => setDeleteConfirm(true)}
          >
            Delete my account
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-destructive font-medium">
              Are you sure?
            </span>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDeletingAccount}
              onClick={onDeleteAccount}
            >
              {isDeletingAccount ? "Deleting…" : "Yes, delete"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeleteConfirm(false)}
            >
              Cancel
            </Button>
          </div>
        )}

        <Button
          type="submit"
          form="profile-form"
          disabled={isUpdating}
          className="bg-blue-600 text-white hover:bg-blue-700 rounded-none px-6"
        >
          {isUpdating ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
