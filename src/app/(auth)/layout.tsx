import type { Metadata } from "next";
import "@/app/globals.css";
import Reusable from "@/app/_components/auth/Reusable";

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
    <html lang="en">
      <body className="min-h-screen flex antialiased">
        <main className="flex items-center justify-center w-full">
          <Reusable />
          <div className="flex flex-1 items-center justify-center">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
