export interface IntegrationTab {
  id: string;
  name: string;
  title: string;
  description: string;
  files: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

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
  // Existing fields
  tashkilotTuri: string; // Organization Type
  sorovlarOrtachaOylik: number; // Average monthly requests
  qaysiTashkilotTomondan: string; // Which organization is forming
  axborotTizimiNomi: string; // Information system name
  // New fields from image
  tashkilotShakli: string; // Organization form (state/private)
  asosiyMaqsad: string; // Main purpose of integration
  normativHuquqiyHujjat: string; // Normative-legal document
  texnologikYoriknomaMavjudligi: boolean; // Availability of technological guidelines
  maqlumotAlmashishSharti: string; // Data exchange condition
  mspdManzil: string; // MSPD entry and exit address
  // Dynamic tabs
  dynamicTabs?: IntegrationTab[];
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
