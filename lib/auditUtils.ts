"use client";

import { supabase } from "./supabase";

export interface AuditLogEntry {
  id: string;
  userId?: string;
  userEmail: string;
  action: "created" | "updated" | "deleted";
  integrationId?: string;
  integrationName?: string;
  changes?: Record<string, { old?: any; new: any }>;
  createdAt: string;
}

// Get current user email from Supabase auth
export async function getCurrentUserEmail(): Promise<string | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      // User avtorizatsiya qilmagan, lekin xatolikni console'ga yozmaymiz
      return null;
    }
    return user.email || null;
  } catch (error) {
    // Silent fail - user avtorizatsiya qilmagan
    return null;
  }
}

// Audit log yozish
export async function logAuditEntry(
  action: "created" | "updated" | "deleted",
  integrationId: string | null,
  integrationName: string,
  changes?: Record<string, { old?: any; new: any }>
): Promise<boolean> {
  try {
    const userEmail = await getCurrentUserEmail();
    
    if (!userEmail) {
      console.warn("Foydalanuvchi email topilmadi, audit log yozilmadi");
      return false;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase.from("audit_logs").insert({
      user_id: user?.id || null,
      user_email: userEmail,
      action,
      integration_id: integrationId || null,
      integration_name: integrationName,
      changes: changes || null, // JSONB field - Supabase avtomatik handle qiladi
    }).select();

    if (error) {
      console.error("Audit log yozishda xatolik:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return false;
    }

    console.log("Audit log muvaffaqiyatli yozildi:", data);

    return true;
  } catch (error) {
    console.error("Audit log yozishda xatolik:", error);
    return false;
  }
}

// Barcha audit log'larni olish
export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Audit log'larni o'qishda Supabase xatolik:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log("Audit log'lar topilmadi. Jadval mavjudmi?");
      return [];
    }

    const mappedLogs = data.map((log: any) => ({
      id: log.id,
      userId: log.user_id,
      userEmail: log.user_email,
      action: log.action,
      integrationId: log.integration_id,
      integrationName: log.integration_name,
      changes: log.changes 
        ? (typeof log.changes === 'string' 
            ? JSON.parse(log.changes) 
            : log.changes)
        : undefined,
      createdAt: log.created_at,
    }));

    console.log(`Topilgan ${mappedLogs.length} ta audit log`);
    return mappedLogs;
  } catch (error: any) {
    console.error("Audit log'larni o'qishda xatolik:", error);
    // Agar jadval mavjud bo'lmasa, bu haqida xabar berish
    if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
      console.error("'audit_logs' jadvali mavjud emas. Migration'ni ishga tushiring!");
    }
    return [];
  }
}

// Integratsiya o'zgarishlarini solishtirish
export function getChanges(
  oldIntegration: any,
  newIntegration: any
): Record<string, { old: any; new: any }> {
  const changes: Record<string, { old: any; new: any }> = {};

  const fields = [
    "axborotTizimiNomi",
    "integratsiyaUsuli",
    "malumotNomi",
    "tashkilotNomiVaShakli",
    "asosiyMaqsad",
    "normativHuquqiyHujjat",
    "texnologikYoriknomaMavjudligi",
    "malumotFormati",
    "maqlumotAlmashishSharti",
    "yangilanishDavriyligi",
    "malumotHajmi",
    "aloqaKanali",
    "oxirgiUzatishVaqti",
    "markaziyBankAloqa",
    "hamkorAloqa",
    "status",
    "izoh",
  ];

  fields.forEach((field) => {
    const oldValue = oldIntegration?.[field];
    const newValue = newIntegration[field];

    if (oldValue !== newValue) {
      changes[field] = {
        old: oldValue,
        new: newValue,
      };
    }
  });

  return changes;
}

