"use client";

import { supabase } from "./supabase";
import type { User } from "./types";

// Database'dan frontend User formatiga o'zgartirish
function dbToUser(dbUser: any): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role as User["role"],
  };
}

export const userUtils = {
  // Barcha foydalanuvchilarni olish
  getUsers: async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map(dbToUser);
    } catch (error) {
      console.error("Foydalanuvchilarni olishda xatolik:", error);
      throw error;
    }
  },

  // Bitta foydalanuvchini olish
  getUser: async (id: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data ? dbToUser(data) : null;
    } catch (error) {
      console.error("Foydalanuvchini olishda xatolik:", error);
      throw error;
    }
  },

  // Email orqali foydalanuvchini olish
  getUserByEmail: async (email: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle(); // .single() o'rniga .maybeSingle() ishlatamiz

      if (error) {
        // Agar foydalanuvchi topilmasa (PGRST116), null qaytaramiz
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data ? dbToUser(data) : null;
    } catch (error: any) {
      // Agar foydalanuvchi topilmasa, error throw qilmaymiz, null qaytaramiz
      if (error?.code === 'PGRST116' || error?.message?.includes('0 rows')) {
        console.log(`Foydalanuvchi ${email} users jadvalida topilmadi`);
        return null;
      }
      console.error("Foydalanuvchini email orqali olishda xatolik:", error);
      return null; // Error bo'lsa ham null qaytaramiz, chunki auth ishlamay qolmasligi kerak
    }
  },

  // Yangi foydalanuvchi qo'shish
  // Note: Password Supabase Auth'da alohida yaratiladi
  addUser: async (
    userData: {
      name: string;
      email: string;
      role: User["role"];
      password: string;
    }
  ): Promise<User> => {
    try {
      // Avval Supabase Auth'da foydalanuvchi yaratish
      const { data: authData, error: authError } = await supabase.auth.admin?.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Email tasdiqlashni o'tkazib yuborish
      });

      if (authError) {
        // Agar "user already exists" xatosi bo'lsa
        if (authError.message?.includes("already registered") || 
            authError.message?.includes("already exists") ||
            authError.message?.includes("User already registered")) {
          throw new Error("Bu email bilan foydalanuvchi allaqachon mavjud");
        }

        // Agar admin API mavjud bo'lmasa, oddiy signUp ishlatamiz
        // Lekin bu faqat development uchun - production'da admin API kerak
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
        });

        if (signUpError) {
          // Agar "user already exists" xatosi bo'lsa
          if (signUpError.message?.includes("already registered") || 
              signUpError.message?.includes("already exists") ||
              signUpError.message?.includes("User already registered")) {
            throw new Error("Bu email bilan foydalanuvchi allaqachon mavjud");
          }
          throw signUpError;
        }
        if (!signUpData.user) throw new Error("Foydalanuvchi yaratilmadi");

        // Users jadvaliga qo'shish
        const { data, error } = await supabase
          .from("users")
          .insert({
            id: signUpData.user.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;
        return dbToUser(data);
      }

      // Admin API mavjud bo'lsa
      if (!authData.user) throw new Error("Foydalanuvchi yaratilmadi");

      // Users jadvaliga qo'shish
      const { data, error } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return dbToUser(data);
    } catch (error) {
      console.error("Foydalanuvchi qo'shishda xatolik:", error);
      throw error;
    }
  },

  // Foydalanuvchini yangilash
  updateUser: async (
    id: string,
    updates: Partial<Pick<User, "name" | "email" | "role">>
  ): Promise<User | null> => {
    try {
      const dbUpdates: Record<string, any> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.role !== undefined) dbUpdates.role = updates.role;

      dbUpdates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("users")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data ? dbToUser(data) : null;
    } catch (error) {
      console.error("Foydalanuvchini yangilashda xatolik:", error);
      throw error;
    }
  },

  // Foydalanuvchi parolini yangilash
  updateUserPassword: async (userId: string, newPassword: string): Promise<boolean> => {
    try {
      // Supabase Admin API orqali parolni yangilash
      // Note: Bu faqat server-side yoki admin API bilan ishlaydi
      // Agar admin API mavjud bo'lmasa, Edge Function yozish kerak
      const { error } = await supabase.auth.admin?.updateUserById(userId, {
        password: newPassword,
      });

      if (error) {
        console.warn("Admin API mavjud emas. Parol yangilash uchun Edge Function ishlatilishi kerak.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Parolni yangilashda xatolik:", error);
      return false;
    }
  },

  // Foydalanuvchini o'chirish
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      // Avval Auth'dan o'chirish (agar admin API mavjud bo'lsa)
      // Bu muhim, chunki agar Auth'dan o'chirilmasa, keyin qayta create qilishga harakat qilganda
      // "user already exists" xatosi chiqadi
      try {
        const { error: authError } = await supabase.auth.admin?.deleteUser(id);
        if (authError) {
          console.warn("Auth'dan o'chirishda xatolik:", authError);
          // Admin API mavjud bo'lmasa yoki xatolik bo'lsa ham davom etamiz
        }
      } catch (error) {
        console.warn("Auth admin API mavjud emas yoki xatolik:", error);
        // Admin API mavjud bo'lmasa, oddiy signOut orqali sessionni tozalashga harakat qilamiz
        // Lekin bu user'ni Auth'dan to'liq o'chirmaydi
        // Bu holatda user keyinroq qayta yaratilganda muammo bo'lishi mumkin
      }

      // Keyin users jadvalidan o'chirish
      const { error: userError } = await supabase.from("users").delete().eq("id", id);

      if (userError) throw userError;

      return true;
    } catch (error) {
      console.error("Foydalanuvchini o'chirishda xatolik:", error);
      throw error;
    }
  },
};

