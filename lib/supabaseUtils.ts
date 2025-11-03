"use client";

import { supabase } from "./supabase";
import type { Integration, IntegrationTab } from "./types";
import { logAuditEntry, getChanges } from "./auditUtils";

// Database formatdan frontend formatga o'girish
const dbToIntegration = (
  dbIntegration: {
    id: string;
    sequential_number?: number;
    axborot_tizimi_nomi: string;
    integratsiya_usuli: string;
    malumot_nomi: string;
    tashkilot_nomi_va_shakli: string;
    asosiy_maqsad: string;
    normativ_huquqiy_hujjat: string;
    texnologik_yoriknoma_mavjudligi: string;
    malumot_formati: "JSON" | "XML" | "CSV" | "SOAP" | "REST API";
    maqlumot_almashish_sharti: string;
    yangilanish_davriyligi: string;
    malumot_hajmi: string;
    aloqa_kanali: string;
    oxirgi_uzatish_vaqti: string;
    markaziy_bank_aloqa: string;
    hamkor_aloqa: string;
    status: "faol" | "testda" | "rejalashtirilgan" | "muammoli";
    izoh: string;
    created_at: string;
    updated_at: string;
  },
  tabs?: Array<{
    id: string;
    integration_id: string;
    name: string;
    column_key: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
  }>,
  files?: Array<{
    id: string;
    tab_id: string;
    name: string;
    size: number;
    type: string;
    url: string | null;
    created_at: string;
  }>
): Integration => {
  // Tabs va files'ni birlashtirish
  const dynamicTabs: IntegrationTab[] | undefined = tabs?.map((tab) => ({
    id: tab.id,
    name: tab.name,
    columnKey: tab.column_key,
    title: tab.title,
    description: tab.description,
      files:
        files
          ?.filter((file: any) => file.tab_id === tab.id)
          .map((file: any) => ({
            id: file.id,
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url || undefined,
          })) || [],
    createdAt: tab.created_at,
    updatedAt: tab.updated_at,
  }));

  return {
    id: dbIntegration.id,
    sequentialNumber: dbIntegration.sequential_number,
    axborotTizimiNomi: dbIntegration.axborot_tizimi_nomi,
    integratsiyaUsuli: dbIntegration.integratsiya_usuli,
    malumotNomi: dbIntegration.malumot_nomi,
    tashkilotNomiVaShakli: dbIntegration.tashkilot_nomi_va_shakli,
    asosiyMaqsad: dbIntegration.asosiy_maqsad,
    normativHuquqiyHujjat: dbIntegration.normativ_huquqiy_hujjat,
    texnologikYoriknomaMavjudligi:
      dbIntegration.texnologik_yoriknoma_mavjudligi,
    malumotFormati: dbIntegration.malumot_formati,
    maqlumotAlmashishSharti: dbIntegration.maqlumot_almashish_sharti,
    yangilanishDavriyligi: dbIntegration.yangilanish_davriyligi,
    malumotHajmi: dbIntegration.malumot_hajmi,
    aloqaKanali: dbIntegration.aloqa_kanali,
    oxirgiUzatishVaqti: dbIntegration.oxirgi_uzatish_vaqti,
    markaziyBankAloqa: dbIntegration.markaziy_bank_aloqa,
    hamkorAloqa: dbIntegration.hamkor_aloqa,
    status: dbIntegration.status,
    izoh: dbIntegration.izoh,
    dynamicTabs,
    createdAt: dbIntegration.created_at,
    updatedAt: dbIntegration.updated_at,
  };
};

// Frontend formatdan database formatga o'girish
const integrationToDb = (
  integration: Omit<
    Integration,
    "id" | "createdAt" | "updatedAt" | "dynamicTabs"
  > & {
    dynamicTabs?: Array<{
      name: string;
      columnKey: string;
      title: string;
      description: string;
      files: Array<{
        name: string;
        size: number;
        type: string;
        url?: string;
      }>;
    }>;
  }
) => {
  return {
    axborot_tizimi_nomi: integration.axborotTizimiNomi,
    integratsiya_usuli: integration.integratsiyaUsuli,
    malumot_nomi: integration.malumotNomi,
    tashkilot_nomi_va_shakli: integration.tashkilotNomiVaShakli,
    asosiy_maqsad: integration.asosiyMaqsad,
    normativ_huquqiy_hujjat: integration.normativHuquqiyHujjat,
    texnologik_yoriknoma_mavjudligi:
      integration.texnologikYoriknomaMavjudligi,
    malumot_formati: integration.malumotFormati,
    maqlumot_almashish_sharti: integration.maqlumotAlmashishSharti,
    yangilanish_davriyligi: integration.yangilanishDavriyligi,
    malumot_hajmi: integration.malumotHajmi,
    aloqa_kanali: integration.aloqaKanali,
    oxirgi_uzatish_vaqti: integration.oxirgiUzatishVaqti,
    markaziy_bank_aloqa: integration.markaziyBankAloqa,
    hamkor_aloqa: integration.hamkorAloqa,
    status: integration.status,
    izoh: integration.izoh,
  };
};


export const supabaseUtils = {
  // Barcha integratsiyalarni o'qish
  getIntegrations: async (): Promise<Integration[]> => {
    try {
      const { data: integrations, error } = await supabase
        .from("integrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!integrations || integrations.length === 0) {
        return [];
      }

      // Tabs va files'larni olish
      const integrationIds = integrations.map((i) => i.id);
      const { data: tabs } = await supabase
        .from("integration_tabs")
        .select("*")
        .in("integration_id", integrationIds);

      const tabIds = tabs?.map((t) => t.id) || [];
      const { data: files } =
        tabIds.length > 0
          ? await supabase
              .from("integration_files")
              .select("*")
              .in("tab_id", tabIds)
          : { data: null };

      // Ma'lumotlarni birlashtirish
      return integrations.map((integration) =>
        dbToIntegration(
          integration,
          (tabs as any)?.filter((t: any) => t.integration_id === integration.id) ||
            [],
          (files as any)?.filter((f: any) =>
            (tabs as any)?.some(
              (t: any) => t.id === f.tab_id && t.integration_id === integration.id
            )
          ) || []
        )
      );
    } catch (error) {
      console.error("Integratsiyalarni o'qishda xatolik:", error);
      return [];
    }
  },

  // Bitta integratsiyani o'qish
  getIntegration: async (id: string): Promise<Integration | null> => {
    try {
      const { data: integration, error } = await supabase
        .from("integrations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!integration) return null;

      // Tabs va files'larni olish
      const { data: tabs } = await supabase
        .from("integration_tabs")
        .select("*")
        .eq("integration_id", id);

      const tabIds = tabs?.map((t) => t.id) || [];
      const { data: files } =
        tabIds.length > 0
          ? await supabase
              .from("integration_files")
              .select("*")
              .in("tab_id", tabIds)
          : { data: null };

      return dbToIntegration(
        integration,
        (tabs as any) || [],
        (files as any) || []
      );
    } catch (error) {
      console.error("Integratsiyani o'qishda xatolik:", error);
      return null;
    }
  },

  // Yangi integratsiya qo'shish
  addIntegration: async (
    integration: Omit<
      Integration,
      "id" | "createdAt" | "updatedAt" | "dynamicTabs"
    > & {
      dynamicTabs?: Array<{
        name: string;
        columnKey: string;
        title: string;
        description: string;
        files: Array<{
          name: string;
          size: number;
          type: string;
          url?: string;
        }>;
      }>;
    }
  ): Promise<Integration> => {
    try {
      const dbData = integrationToDb(integration);

      // Integratsiyani saqlash
      const { data: newIntegration, error: integrationError } = await supabase
        .from("integrations")
        .insert(dbData)
        .select()
        .single();

      if (integrationError) throw integrationError;
      if (!newIntegration) throw new Error("Integratsiya saqlanmadi");

      // Dynamic tabs va files'larni saqlash
      if (integration.dynamicTabs && integration.dynamicTabs.length > 0) {
        const tabsToInsert = integration.dynamicTabs.map((tab) => ({
          integration_id: newIntegration.id,
          name: tab.name,
          column_key: tab.columnKey,
          title: tab.title,
          description: tab.description,
        }));

        const { data: insertedTabs, error: tabsError } = await supabase
          .from("integration_tabs")
          .insert(tabsToInsert)
          .select();

        if (tabsError) throw tabsError;

        // Files'larni saqlash
        if (insertedTabs) {
        const filesToInsert: Array<{
          tab_id: string;
          name: string;
          size: number;
          type: string;
          url: string | null;
        }> = [];
          integration.dynamicTabs.forEach((tab, tabIndex) => {
            if (tab.files && tab.files.length > 0) {
              tab.files.forEach((file) => {
                filesToInsert.push({
                  tab_id: insertedTabs[tabIndex].id,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  url: file.url || null,
                });
              });
            }
          });

          if (filesToInsert.length > 0) {
            const { error: filesError } = await supabase
              .from("integration_files")
              .insert(filesToInsert);

            if (filesError) throw filesError;
          }
        }
      }

      // To'liq integratsiyani qaytarish
      const fullIntegration = await supabaseUtils.getIntegration(
        newIntegration.id
      );
      if (!fullIntegration) throw new Error("Integratsiya topilmadi");

      // Audit log yozish
      await logAuditEntry(
        "created",
        fullIntegration.id,
        fullIntegration.axborotTizimiNomi
      );

      return fullIntegration;
    } catch (error) {
      console.error("Integratsiya qo'shishda xatolik:", error);
      throw error;
    }
  },

  // Integratsiyani yangilash
  updateIntegration: async (
    id: string,
    updates: Partial<Integration>
  ): Promise<Integration | null> => {
    try {
      const dbUpdates: Record<string, any> = {};

      if (updates.axborotTizimiNomi !== undefined)
        dbUpdates.axborot_tizimi_nomi = updates.axborotTizimiNomi;
      if (updates.integratsiyaUsuli !== undefined)
        dbUpdates.integratsiya_usuli = updates.integratsiyaUsuli;
      if (updates.malumotNomi !== undefined)
        dbUpdates.malumot_nomi = updates.malumotNomi;
      if (updates.tashkilotNomiVaShakli !== undefined)
        dbUpdates.tashkilot_nomi_va_shakli = updates.tashkilotNomiVaShakli;
      if (updates.asosiyMaqsad !== undefined)
        dbUpdates.asosiy_maqsad = updates.asosiyMaqsad;
      if (updates.normativHuquqiyHujjat !== undefined)
        dbUpdates.normativ_huquqiy_hujjat = updates.normativHuquqiyHujjat;
      if (updates.texnologikYoriknomaMavjudligi !== undefined)
        dbUpdates.texnologik_yoriknoma_mavjudligi =
          updates.texnologikYoriknomaMavjudligi;
      if (updates.malumotFormati !== undefined)
        dbUpdates.malumot_formati = updates.malumotFormati;
      if (updates.maqlumotAlmashishSharti !== undefined)
        dbUpdates.maqlumot_almashish_sharti = updates.maqlumotAlmashishSharti;
      if (updates.yangilanishDavriyligi !== undefined)
        dbUpdates.yangilanish_davriyligi = updates.yangilanishDavriyligi;
      if (updates.malumotHajmi !== undefined)
        dbUpdates.malumot_hajmi = updates.malumotHajmi;
      if (updates.aloqaKanali !== undefined)
        dbUpdates.aloqa_kanali = updates.aloqaKanali;
      if (updates.oxirgiUzatishVaqti !== undefined)
        dbUpdates.oxirgi_uzatish_vaqti = updates.oxirgiUzatishVaqti;
      if (updates.markaziyBankAloqa !== undefined)
        dbUpdates.markaziy_bank_aloqa = updates.markaziyBankAloqa;
      if (updates.hamkorAloqa !== undefined)
        dbUpdates.hamkor_aloqa = updates.hamkorAloqa;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.izoh !== undefined) dbUpdates.izoh = updates.izoh;

      dbUpdates.updated_at = new Date().toISOString();

      // Eski integratsiyani olish (o'zgarishlarni aniqlash uchun)
      const oldIntegration = await supabaseUtils.getIntegration(id);

      const { error } = await supabase
        .from("integrations")
        .update(dbUpdates)
        .eq("id", id);

      if (error) throw error;

      // Dynamic tabs va files'larni yangilash
      if (updates.dynamicTabs !== undefined) {
        // Mavjud tabs va files'larni olish
        const { data: existingTabs } = await supabase
          .from("integration_tabs")
          .select("id")
          .eq("integration_id", id);

        const existingTabIds = existingTabs?.map((t) => t.id) || [];
        const existingFileIds: string[] = [];

        if (existingTabIds.length > 0) {
          const { data: existingFiles } = await supabase
            .from("integration_files")
            .select("id, tab_id")
            .in("tab_id", existingTabIds);

          existingFileIds.push(...(existingFiles?.map((f) => f.id) || []));
        }

        // Yangi tabs va files'larni tayyorlash
        const newTabIds: string[] = [];
        const newFileIds: string[] = [];

        // Eski tabs va files'larni o'chirish (yangi ro'yxatda yo'q bo'lganlarni)
        const providedTabIds = updates.dynamicTabs
          .map((tab: any) => tab.id)
          .filter((tabId: string) => tabId && tabId.startsWith("tab_") === false);

        const tabsToDelete = existingTabIds.filter(
          (tabId) => !providedTabIds.includes(tabId)
        );

        if (tabsToDelete.length > 0) {
          // O'chiriladigan tab'lardagi files'larni o'chirish
          const { data: filesToDelete } = await supabase
            .from("integration_files")
            .select("id")
            .in("tab_id", tabsToDelete);

          if (filesToDelete && filesToDelete.length > 0) {
            await supabase
              .from("integration_files")
              .delete()
              .in("id", filesToDelete.map((f) => f.id));
          }

          // Tab'larni o'chirish
          await supabase
            .from("integration_tabs")
            .delete()
            .in("id", tabsToDelete);
        }

        // Har bir tab uchun
        for (const tab of updates.dynamicTabs) {
          let tabId = tab.id;

          // Agar tab yangi bo'lsa (id yo'q yoki temp id)
          if (!tabId || tabId.startsWith("tab_")) {
            const { data: newTab, error: tabError } = await supabase
              .from("integration_tabs")
              .insert({
                integration_id: id,
                name: tab.name,
                column_key: tab.columnKey,
                title: tab.title || null,
                description: tab.description || null,
              })
              .select()
              .single();

            if (tabError) throw tabError;
            tabId = newTab.id;
            newTabIds.push(tabId);
          } else {
            // Mavjud tab'ni yangilash
            const { error: updateTabError } = await supabase
              .from("integration_tabs")
              .update({
                name: tab.name,
                column_key: tab.columnKey,
                title: tab.title || null,
                description: tab.description || null,
                updated_at: new Date().toISOString(),
              })
              .eq("id", tabId);

            if (updateTabError) throw updateTabError;
            newTabIds.push(tabId);

            // Mavjud files'larni olish
            const { data: existingFiles } = await supabase
              .from("integration_files")
              .select("id")
              .eq("tab_id", tabId);

            const existingFileIdsForTab =
              existingFiles?.map((f) => f.id) || [];

            // Yangi files ro'yxatidagi id'larni olish
            const providedFileIds = tab.files
              .map((file: any) => file.id)
              .filter(
                (fileId: string) =>
                  fileId && fileId.startsWith("file_") === false
              );

            // O'chirilishi kerak bo'lgan files'lar
            const filesToDelete = existingFileIdsForTab.filter(
              (fileId) => !providedFileIds.includes(fileId)
            );

            if (filesToDelete.length > 0) {
              await supabase
                .from("integration_files")
                .delete()
                .in("id", filesToDelete);
            }
          }

          // Files'larni qo'shish/yangilash
          if (tab.files && tab.files.length > 0) {
            for (const file of tab.files) {
              if (file.id && !file.id.startsWith("file_")) {
                // Mavjud file'ni yangilash
                const { error: updateFileError } = await supabase
                  .from("integration_files")
                  .update({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: file.url || null,
                  })
                  .eq("id", file.id);

                if (updateFileError) throw updateFileError;
                newFileIds.push(file.id);
              } else {
                // Yangi file qo'shish
                const { data: newFile, error: fileError } = await supabase
                  .from("integration_files")
                  .insert({
                    tab_id: tabId,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: file.url || null,
                  })
                  .select()
                  .single();

                if (fileError) throw fileError;
                if (newFile) newFileIds.push(newFile.id);
              }
            }
          }
        }
      }

      const updatedIntegration = await supabaseUtils.getIntegration(id);
      
      if (updatedIntegration && oldIntegration) {
        // O'zgarishlarni aniqlash
        const changes = getChanges(oldIntegration, updatedIntegration);
        
        // Audit log yozish
        await logAuditEntry(
          "updated",
          updatedIntegration.id,
          updatedIntegration.axborotTizimiNomi,
          Object.keys(changes).length > 0 ? changes : undefined
        );
      }
      
      return updatedIntegration;
    } catch (error) {
      console.error("Integratsiyani yangilashda xatolik:", error);
      throw error;
    }
  },

  // Integratsiyani o'chirish
  deleteIntegration: async (id: string): Promise<boolean> => {
    try {
      // Avval integratsiya ma'lumotlarini olish (audit log uchun)
      const integration = await supabaseUtils.getIntegration(id);
      const integrationName = integration?.axborotTizimiNomi || "Noma'lum";

      // Avval files'larni o'chirish
      const { data: tabs } = await supabase
        .from("integration_tabs")
        .select("id")
        .eq("integration_id", id);

      if (tabs && tabs.length > 0) {
        const tabIds = tabs.map((t) => t.id);
        await supabase.from("integration_files").delete().in("tab_id", tabIds);
      }

      // Keyin tabs'larni o'chirish
      await supabase.from("integration_tabs").delete().eq("integration_id", id);

      // Nihoyat integratsiyani o'chirish
      const { error } = await supabase.from("integrations").delete().eq("id", id);

      if (error) throw error;

      // Audit log yozish
      await logAuditEntry("deleted", id, integrationName);

      return true;
    } catch (error) {
      console.error("Integratsiyani o'chirishda xatolik:", error);
      return false;
    }
  },

  // Dynamic tab qo'shish
  addTabToIntegration: async (
    integrationId: string,
    tabData: Omit<IntegrationTab, "id" | "createdAt" | "updatedAt">
  ): Promise<Integration | null> => {
    try {
      const { data: newTab, error } = await supabase
        .from("integration_tabs")
        .insert({
          integration_id: integrationId,
          name: tabData.name,
          column_key: tabData.columnKey,
          title: tabData.title,
          description: tabData.description,
        })
        .select()
        .single();

      if (error) throw error;

      // Files'larni saqlash
      if (tabData.files && tabData.files.length > 0 && newTab) {
        const filesToInsert = tabData.files.map((file) => ({
          tab_id: newTab.id,
          name: file.name,
          size: file.size,
          type: file.type,
          url: file.url || null,
        }));

        await supabase.from("integration_files").insert(filesToInsert);
      }

      return await supabaseUtils.getIntegration(integrationId);
    } catch (error) {
      console.error("Tab qo'shishda xatolik:", error);
      return null;
    }
  },

  // Dynamic tab o'chirish
  removeTabFromIntegration: async (
    integrationId: string,
    tabId: string
  ): Promise<Integration | null> => {
    try {
      // Avval files'larni o'chirish
      await supabase.from("integration_files").delete().eq("tab_id", tabId);

      // Keyin tab'ni o'chirish
      const { error } = await supabase
        .from("integration_tabs")
        .delete()
        .eq("id", tabId);

      if (error) throw error;

      return await supabaseUtils.getIntegration(integrationId);
    } catch (error) {
      console.error("Tab o'chirishda xatolik:", error);
      return null;
    }
  },
};

