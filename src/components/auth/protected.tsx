"use client";

import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function Protected({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  useEffect(() => {
    if (!loading && user === null) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );

  return <>{children}</>;
}
