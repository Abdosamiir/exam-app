import ChangePasswordForm from "@/features/profile/components/change-password/change-password-form";

export default function AdminChangePasswordPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Change Password</h2>
      <ChangePasswordForm />
    </div>
  );
}
