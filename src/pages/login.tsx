"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email va parolni kiriting");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await login(email, password);

      if (error) {
        toast.error(error);
      } else {
        toast.success("Muvaffaqiyatli kirildi!");
        navigate("/integrations", { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || "Kirishda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-layout">
      <div className="login-layout__wrapper">
        <div className="login-layout__left">
          <div>
            <div className="login-layout__brand">
              <img
                src="/cbu-logo.png"
                alt="Ozbekiston Respublikasi Markaziy banki logotipi"
                className="login-layout__brand-logo"
              />
              <div className="login-layout__brand-text">
                <span className="login-layout__brand-caption">
                  O&apos;zbekiston Respublikasi
                </span>
                <span className="login-layout__brand-caption login-layout__brand-caption--bold">
                  Markaziy banki
                </span>
              </div>
            </div>
            <p className="login-layout__subtitle login-layout__subtitle--accent">
              Integratsiyalar reestriga
            </p>
            <h1 className="login-layout__headline">Xush kelibsiz</h1>
          </div>

          <div className="login-layout__form space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">Tizimga kirish</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="login-layout__input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Parol</Label>
                <div className="login-layout__input-wrapper">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Parolingizni kiriting"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="login-layout__input login-layout__input--with-toggle"
                  />
                  <button
                    type="button"
                    className="login-layout__input-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"
                    }
                    aria-pressed={showPassword}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="login-layout__submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kirilmoqda...
                  </>
                ) : (
                  "Kirish"
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="login-layout__logo-panel">
          <img src="/cbu.webp" alt="Markaziy bank binosi" />
        </div>
      </div>
    </div>
  );
}
