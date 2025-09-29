"use client";

import type { ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldX } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Array<"Administrator" | "Operator" | "Viewer">;
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role as any)) {
    return (
      fallback || (
        <Alert variant="destructive">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            Sizda ushbu sahifaga kirish huquqi yo'q. Kerakli ruxsat:{" "}
            {allowedRoles.join(", ")}
          </AlertDescription>
        </Alert>
      )
    );
  }

  return <>{children}</>;
}
