"use client";

import type { ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldX } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Array<"Administrator" | "Operator" | "Viewer">;
  userRole?: "Administrator" | "Operator" | "Viewer";
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  userRole = "Administrator", // Mock current user role
  fallback,
}: RoleGuardProps) {
  if (!allowedRoles.includes(userRole)) {
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
