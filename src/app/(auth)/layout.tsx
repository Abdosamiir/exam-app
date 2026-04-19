import type { Metadata } from "next";
import AuthReusableSection from "@/features/auth/components/auth-resuable-section";

export const metadata: Metadata = {
  title: "Exam App",
  description: "Smart exam platform",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center antialiased">
      <AuthReusableSection />
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </main>
  );
}
