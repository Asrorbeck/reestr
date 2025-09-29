"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { LoginHeader } from "@/components/auth/login-header";
import { AuthGuard } from "@/components/auth/auth-guard";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <AuthGuard>
      {isLoginPage ? (
        <div className="h-screen bg-background overflow-hidden">
          <LoginHeader />
          <main className="flex items-center justify-center h-[calc(100vh-80px)] p-2 overflow-hidden">
            {children}
          </main>
        </div>
      ) : (
        <div className="flex h-screen bg-background">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
