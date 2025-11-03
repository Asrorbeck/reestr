"use client";

import { supabase } from "./supabase";
import { userUtils } from "./userUtils";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  user: {
    id: string;
    email: string;
    role?: "Administrator" | "Operator" | "Viewer";
  } | null;
  loading: boolean;
  setUser: (user: { id: string; email: string; role?: "Administrator" | "Operator" | "Viewer" } | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            return { error: error.message };
          }

          if (data.user) {
            // Foydalanuvchi roli bilan olish
            try {
              const userProfile = await userUtils.getUserByEmail(data.user.email || email);
              
              // Agar userProfile null bo'lsa, foydalanuvchi users jadvalida yo'q
              if (!userProfile) {
                await supabase.auth.signOut();
                return { error: "Foydalanuvchi topilmadi yoki o'chirilgan" };
              }
              
              set({
                user: {
                  id: data.user.id,
                  email: data.user.email || email,
                  role: userProfile.role,
                },
              });
              return { error: null };
            } catch (error) {
              // Agar xatolik bo'lsa, logout qilamiz
              await supabase.auth.signOut();
              return { error: "Foydalanuvchi ma'lumotlarini olishda xatolik" };
            }
          }

          return { error: "Login failed" };
        } catch (error: any) {
          return { error: error.message || "Login failed" };
        }
      },
      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ user: null });
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
      checkAuth: async () => {
        try {
          // Avval localStorage'dan user'ni o'qib ko'ramiz (loading false bo'lishi uchun)
          const storedUser = JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.user;
          
          set({ loading: true });
          
          // Faqat session'ni tekshiramiz, role'ni localStorage'dan olamiz
          const { data: { user: authUser }, error } = await supabase.auth.getUser();

          if (error || !authUser) {
            set({ user: null, loading: false });
            return;
          }

          // Agar localStorage'da user mavjud va email mos kelsa, role'ni localStorage'dan olamiz
          // Bu har safar backend'dan so'ramasligimiz uchun
          if (storedUser && storedUser.email === authUser.email && storedUser.role) {
            set({
              user: {
                id: authUser.id,
                email: authUser.email || "",
                role: storedUser.role,
              },
              loading: false,
            });
            return;
          }

          // Agar localStorage'da user yo'q yoki role yo'q bo'lsa, backend'dan so'ramiz
          // Bu faqat birinchi marta yoki role o'zgarganda bo'ladi
          try {
            const userProfile = await userUtils.getUserByEmail(authUser.email || "");
            
            // Agar userProfile null bo'lsa, foydalanuvchi users jadvalida yo'q demakdir
            // Bu foydalanuvchi o'chirilgan bo'lishi mumkin
            if (!userProfile) {
              // Foydalanuvchi users jadvalida yo'q, sessionni tozalash
              console.log(`Foydalanuvchi ${authUser.email} users jadvalida topilmadi, logout qilinmoqda`);
              await supabase.auth.signOut();
              set({ user: null, loading: false });
              return;
            }
            
            set({
              user: {
                id: authUser.id,
                email: authUser.email || "",
                role: userProfile.role,
              },
              loading: false,
            });
          } catch (error) {
            // Agar xatolik bo'lsa, foydalanuvchini logout qilamiz
            console.error("Auth check error:", error);
            await supabase.auth.signOut();
            set({ user: null, loading: false });
          }
        } catch (error) {
          console.error("Auth check error:", error);
          set({ user: null, loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);

