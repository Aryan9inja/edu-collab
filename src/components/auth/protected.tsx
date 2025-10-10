"use client";

import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function Protected({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!user) fetchUser();
  }, []);

  useEffect(() => {
    if (!loading && user === null) {
      router.push("/login");
    }
  }, [loading, user]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}
