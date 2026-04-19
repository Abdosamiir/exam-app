import React from "react";
import ReactQueryProvider from "./_components/react-query.provider";
import NextAuthProvider from "./_components/next-auth-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <NextAuthProvider>{children}</NextAuthProvider>
    </ReactQueryProvider>
  );
}
