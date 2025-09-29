"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Agar loading tugagan va authenticated bo'lmasa va login sahifasida bo'lmasa
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
    // Agar authenticated bo'lsa va login sahifasida bo'lsa, dashboard ga yo'naltir
    else if (!isLoading && isAuthenticated && pathname === "/login") {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Agar authenticated bo'lmasa va login sahifasida bo'lmasa, hech narsa ko'rsatma
  if (!isAuthenticated && pathname !== "/login") {
    return null;
  }

  // Agar authenticated bo'lsa va login sahifasida bo'lsa, hech narsa ko'rsatma (redirect bo'ladi)
  if (isAuthenticated && pathname === "/login") {
    return null;
  }

  return <>{children}</>;
}
