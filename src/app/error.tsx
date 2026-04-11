"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Something went wrong</h1>

      <p className="text-gray-500">{error.message}</p>

      <button
        onClick={reset}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Try Again
      </button>
    </div>
  );
}
