"use client";

import type { User } from "./types";

export type UserRole = "Administrator" | "Operator" | "Viewer";

export interface Permissions {
  // Integratsiyalar
  canViewIntegrations: boolean;
  canCreateIntegrations: boolean;
  canEditIntegrations: boolean;
  canDeleteIntegrations: boolean;

  // Audit
  canViewAudit: boolean;

  // Foydalanuvchilar
  canViewUsers: boolean;
  canManageUsers: boolean; // create, edit, delete

  // Sozlamalar
  canViewSettings: boolean;
  canManageSettings: boolean;

  // Monitoring/Analytics
  canViewAnalytics: boolean;
}

// Rolga qarab ruxsatlar
export function getRolePermissions(role: UserRole | undefined): Permissions {
  if (!role) {
    // Agar rol mavjud bo'lmasa, faqat ko'rish ruxsati
    return {
      canViewIntegrations: false,
      canCreateIntegrations: false,
      canEditIntegrations: false,
      canDeleteIntegrations: false,
      canViewAudit: false,
      canViewUsers: false,
      canManageUsers: false,
      canViewSettings: false,
      canManageSettings: false,
      canViewAnalytics: false,
    };
  }

  switch (role) {
    case "Administrator":
      return {
        canViewIntegrations: true,
        canCreateIntegrations: true,
        canEditIntegrations: true,
        canDeleteIntegrations: true,
        canViewAudit: true,
        canViewUsers: true,
        canManageUsers: true,
        canViewSettings: true,
        canManageSettings: true,
        canViewAnalytics: true,
      };

    case "Operator":
      return {
        canViewIntegrations: true,
        canCreateIntegrations: true,
        canEditIntegrations: true,
        canDeleteIntegrations: false, // Operator o'chira olmaydi
        canViewAudit: true,
        canViewUsers: false,
        canManageUsers: false,
        canViewSettings: false,
        canManageSettings: false,
        canViewAnalytics: true,
      };

    case "Viewer":
      return {
        canViewIntegrations: true,
        canCreateIntegrations: false,
        canEditIntegrations: false,
        canDeleteIntegrations: false,
        canViewAudit: true,
        canViewUsers: false,
        canManageUsers: false,
        canViewSettings: false,
        canManageSettings: false,
        canViewAnalytics: true,
      };

    default:
      return {
        canViewIntegrations: false,
        canCreateIntegrations: false,
        canEditIntegrations: false,
        canDeleteIntegrations: false,
        canViewAudit: false,
        canViewUsers: false,
        canManageUsers: false,
        canViewSettings: false,
        canManageSettings: false,
        canViewAnalytics: false,
      };
  }
}

// Qisqa tekshiruvlar
export function hasPermission(role: UserRole | undefined, permission: keyof Permissions): boolean {
  const permissions = getRolePermissions(role);
  return permissions[permission];
}

// Administratormi tekshirish
export function isAdministrator(role: UserRole | undefined): boolean {
  return role === "Administrator";
}

// Operator yoki Administratormi tekshirish
export function canModifyIntegrations(role: UserRole | undefined): boolean {
  return role === "Administrator" || role === "Operator";
}

