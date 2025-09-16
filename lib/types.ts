export interface Integration {
  id: string;
  nomi: string; // Name
  vazirlik: string; // Ministry/Organization
  huquqiyAsos: string; // Legal Basis
  texnologiya: "REST" | "SOAP" | "MQ" | "File exchange";
  status: "Active" | "Test" | "Archived";
  sana: string; // Date
  muddat: string; // Duration
  tavsif?: string; // Description
  // New fields
  tashkilotTuri: string; // Organization Type
  sorovlarOrtachaOylik: number; // Average monthly requests
  qaysiTashkilotTomondan: string; // Which organization is forming
  axborotTizimiNomi: string; // Information system name
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Operator" | "Viewer";
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  integrationId?: string;
  integrationName?: string;
  changes?: Record<string, any>;
  timestamp: string;
}

export interface DashboardStats {
  totalIntegrations: number;
  activeIntegrations: number;
  testIntegrations: number;
  archivedIntegrations: number;
  integrationsByMinistry: Record<string, number>;
  integrationsByTechnology: Record<string, number>;
  recentActivity: AuditLog[];
}
