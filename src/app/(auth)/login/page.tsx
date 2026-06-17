import { Suspense } from "react";
import LoginForm from "@/features/auth/components/login/login-form";

const LoginPage = () => {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
