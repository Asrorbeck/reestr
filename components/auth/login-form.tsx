"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result: any = await login(email, password);

    if (result && result.success) {
      toast.success("Muvaffaqiyatli kirildi!");
    } else {
      toast.error(result?.error || "Kirishda xatolik yuz berdi");
    }

    setIsLoading(false);
  };

  return (
    <div className="">
      <Card className="w-full sm:w-[90%] md:w-[400px] lg:w-[400px]">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-xl font-bold">Kirish</CardTitle>
          <CardDescription className="text-sm">
            Integratsiyalar reestriga kirish uchun ma'lumotlaringizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email manzil
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@cbu.uz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Parol
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Parolingizni kiriting"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10 px-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  </span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full h-10" disabled={isLoading}>
              {isLoading ? "Kirilmoqda..." : "Kirish"}
            </Button>
          </form>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            Parolni unutdingizmi?{" "}
            <Button variant="link" className="p-0 h-auto font-normal text-xs">
              Qayta tiklash
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
