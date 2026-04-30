import React from "react";
import ReactQueryProvider from "./_components/react-query.provider";
import NextAuthProvider from "./_components/next-auth-provider";
import { TooltipProvider } from "@/shared/components/ui/tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <NextAuthProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </NextAuthProvider>
    </ReactQueryProvider>
  );
}
