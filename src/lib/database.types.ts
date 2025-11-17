export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      integrations: {
        Row: {
          id: string;
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
        };
        Insert: {
          id?: string;
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          axborot_tizimi_nomi?: string;
          integratsiya_usuli?: string;
          malumot_nomi?: string;
          tashkilot_nomi_va_shakli?: string;
          asosiy_maqsad?: string;
          normativ_huquqiy_hujjat?: string;
          texnologik_yoriknoma_mavjudligi?: string;
          malumot_formati?: "JSON" | "XML" | "CSV" | "SOAP" | "REST API";
          maqlumot_almashish_sharti?: string;
          yangilanish_davriyligi?: string;
          malumot_hajmi?: string;
          aloqa_kanali?: string;
          oxirgi_uzatish_vaqti?: string;
          markaziy_bank_aloqa?: string;
          hamkor_aloqa?: string;
          status?: "faol" | "testda" | "rejalashtirilgan" | "muammoli";
          izoh?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      integration_tabs: {
        Row: {
          id: string;
          integration_id: string;
          name: string;
          column_key: string;
          title: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          integration_id: string;
          name: string;
          column_key: string;
          title: string;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          integration_id?: string;
          name?: string;
          column_key?: string;
          title?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      integration_files: {
        Row: {
          id: string;
          tab_id: string;
          name: string;
          size: number;
          type: string;
          url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tab_id: string;
          name: string;
          size: number;
          type: string;
          url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tab_id?: string;
          name?: string;
          size?: number;
          type?: string;
          url?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

