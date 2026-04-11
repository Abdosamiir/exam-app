import Link from "next/link";
import React from "react";

export default function Forbidden() {
  return (
    <main className="grow flex flex-col items-center justify-center py-32 px-16 bg-white dark:bg-zinc-950">
      <h1 className="text-3xl font-bold text-rose-500">403 - Forbidden</h1>

      <p className="text-gray-500">You are forbidden to access this page.</p>

      <Link href="/" className="text-blue-500 hover:text-blue-600 mt-4">
        Go back to the home page
      </Link>
    </main>
  );
}
