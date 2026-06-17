import Link from "next/link";
import React from "react";

export default function UnAuthorized() {
  return (
    <main className="grow flex flex-col items-center justify-center py-32 px-16 bg-white dark:bg-zinc-950">
      <h1 className="text-3xl font-bold text-orange-500">401 - Unauthorized</h1>

      <p className="text-gray-500">
        You are not authorized to access this page.
      </p>

      <Link href="/" className="text-primary hover:text-primary mt-4">
        Go back to the home page
      </Link>
    </main>
  );
}
