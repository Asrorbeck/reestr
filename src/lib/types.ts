export interface IntegrationTab {
  id: string;
  name: string;
  columnKey: string; // Qaysi column uchun tab ochilgan (masalan: normativHuquqiyHujjat)
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
  sequentialNumber?: number; // Integratsiya tartib raqami (0001, 0002, ...)
  // Yangi 18 column struktura
  axborotTizimiNomi: string; // Axborot tizimi yoki resursning to'liq nomi (yoki interfeys)
  integratsiyaUsuli: string; // Integratsiyani amalga oshirish usuli (Idoralararo integrallashuv platformasi orqali yoki to'g'ridan to'g'ri)
  malumotNomi: string; // Uzatiladigan/qabul qilinadigan ma'lumot nomi
  tashkilotNomiVaShakli: string; // Integratsiya qilingan tashkilot nomi va shakli (davlat / xususiy)
  asosiyMaqsad: string; // Integratsiyadan asosiy maqsad
  normativHuquqiyHujjat: string; // Integratsiyani tashkil etish uchun asos bo'luvchi normativ-huquqiy hujjat
  texnologikYoriknomaMavjudligi: string; // Axborot almashinuvi bo'yicha texnologik yo'riqnoma mavjudligi
  malumotFormati: "JSON" | "XML" | "CSV" | "SOAP" | "REST API"; // Ma'lumot formati (badge)
  maqlumotAlmashishSharti: string; // Ma'lumot almashish sharti (so'rov-javob, push, fayl almashinuvi)
  yangilanishDavriyligi: string; // Ma'lumot yangilanish davriyligi (real vaqt, kunlik, haftalik, oylik va hokazo)
  malumotHajmi: string; // Ma'lumot hajmi (kunlik / oylik MB yoki GB)
  aloqaKanali: string; // Hamkor tashkilot bilan aloqa kanali (API, VPN, server va hokazo)
  oxirgiUzatishVaqti: string; // So'nggi muvaffaqiyatli uzatish vaqti (tizimdan online olib beriladi)
  markaziyBankAloqa: string; // Markaziy bank tomonidan texnik aloqa shaxsi (F.I.Sh, telefon, e-mail)
  hamkorAloqa: string; // Hamkor tashkilot tomonidan texnik aloqa shaxsi (F.I.Sh, telefon, e-mail)
  status: "faol" | "testda" | "rejalashtirilgan" | "muammoli"; // Integratsiya holati / statusi (badge)
  izoh: string; // Izoh / qo'shimcha ma'lumot
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
