import { Suspense } from "react";
import ResetPasswordForm from "@/features/auth/components/reset-password/reset-password-form";

const ResetPasswordPage = () => {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
