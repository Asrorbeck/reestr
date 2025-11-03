import type { Integration, User, AuditLog, DashboardStats } from "./types";

export const mockIntegrations: Integration[] = [];

export const mockUsers: User[] = [];

export const mockAuditLogs: AuditLog[] = [];

export const extendedAuditLogs: AuditLog[] = [];

export interface IntegrationVersion {
  id: string;
  integrationId: string;
  version: number;
  data: Partial<Integration>;
  changedBy: string;
  changedAt: string;
  changeReason?: string;
}

export const mockVersionHistory: IntegrationVersion[] = [];

export const mockDashboardStats: DashboardStats = {
  totalIntegrations: 0,
  activeIntegrations: 0,
  testIntegrations: 0,
  archivedIntegrations: 0,
  integrationsByMinistry: {},
  integrationsByTechnology: {},
  recentActivity: extendedAuditLogs,
};
