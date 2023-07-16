"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-3">
      <h1 className="text-3xl font-bold">404</h1>
      <h2 className="text-xl">Post Not Found</h2>
    </div>
  );
}
