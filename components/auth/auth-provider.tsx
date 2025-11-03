"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

const publicRoutes = ["/login"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, checkAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Faqat birinchi marta checkAuth ni chaqiramiz
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Periodik ravishda auth holatini tekshirish (har 5 minutda bir)
  // Bu foydalanuvchi o'chirilgandan keyin logout qilish uchun
  // Lekin juda tez-tez emas, chunki har safar backend'dan so'rayapti
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      checkAuth();
    }, 300000); // 5 daqiqa (300000 ms) - kamroq backend so'rovlari uchun

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && !isPublicRoute) {
      router.replace("/login");
    } else if (user && pathname === "/login") {
      router.replace("/integrations");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user && !publicRoutes.includes(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

