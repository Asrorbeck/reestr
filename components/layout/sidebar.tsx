"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { getRolePermissions } from "@/lib/permissions";
import {
  Database,
  FileText,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const allNavigation = [
  {
    name: "Integratsiyalar",
    href: "/integrations",
    icon: Database,
    permission: "canViewIntegrations" as const,
  },
  {
    name: "Audit jurnali",
    href: "/audit",
    icon: FileText,
    permission: "canViewAudit" as const,
  },
  {
    name: "Foydalanuvchilar",
    href: "/users",
    icon: Users,
    permission: "canViewUsers" as const,
  },
  {
    name: "Sozlamalar",
    href: "/settings",
    icon: Settings,
    permission: "canViewSettings" as const,
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role as "Administrator" | "Operator" | "Viewer" | undefined;
  const permissions = getRolePermissions(role);

  // Faqat ruxsatga ega bo'lgan menyularni ko'rsatish
  const navigation = allNavigation.filter((item) => permissions[item.permission]);

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-sidebar-foreground">
            Menyu
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
