"use client";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

const publicRoutes = ["/login"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, checkAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const interval = setInterval(() => {
      checkAuth();
    }, 300_000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && !isPublicRoute) {
      navigate("/login", { replace: true, state: { from: location } });
    } else if (user && pathname === "/login") {
      navigate("/integrations", { replace: true });
    }
  }, [user, loading, pathname, navigate, location]);

  if (loading || (!user && !publicRoutes.includes(pathname))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

