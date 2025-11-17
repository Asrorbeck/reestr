"use client";

import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { getRolePermissions } from "@/lib/permissions";
import { Database, FileText, Settings, Users } from "lucide-react";

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

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const role = user?.role as
    | "Administrator"
    | "Operator"
    | "Viewer"
    | undefined;
  const permissions = getRolePermissions(role);

  const navigation = allNavigation.filter(
    (item) => permissions[item.permission]
  );

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-70"
      )}
    >
      <div className="flex h-16 items-center justify-center px-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-3 flex-1">
            <div className="relative h-10 w-10 flex-shrink-0">
              <img
                src="/logo.png"
                alt="Markaziy Bank Logo"
                className="h-10 w-10 object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-xs text-muted-foreground leading-none">
                O'zbekiston Respublikasi
              </p>
              <h2 className="text-lg font-semibold text-sidebar-foreground leading-none">
                Markaziy Banki
              </h2>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="relative h-8 w-8 flex-shrink-0 mx-auto">
            <img
              src="/logo.png"
              alt="Markaziy Bank Logo"
              className="h-8 w-8 object-contain"
              loading="lazy"
            />
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive || pathname.startsWith(`${item.href}/`)
                  ? "bg-[#e4a216] text-white dark:text-black"
                  : "text-black dark:text-white hover:bg-[#f0b84d] hover:text-white dark:hover:text-black"
              )
            }
            end={item.href === "/integrations" ? false : true}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
