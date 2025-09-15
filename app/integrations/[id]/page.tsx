"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Integration } from "@/lib/types";
import { mockIntegrations } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Hash,
  FileText,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

const statusColors = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Test: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

const projectStructure = [
  { id: "passport", label: "Pasport", active: true },
  { id: "concept", label: "Konsepsiya", active: false },
  { id: "technical", label: "Texnik topshiriq", active: false },
];

export default function IntegrationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("passport");

  const integration = mockIntegrations.find((item) => item.id === params.id);

  if (!integration) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Integratsiya topilmadi</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Orqaga qaytish
          </Button>
        </div>
      </div>
    );
  }

  const renderPassportContent = () => (
    <div className="space-y-8">
      {/* I. Umumiy ma'lumotlar */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">I. Umumiy ma'lumotlar</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <span className="font-medium">1. Loyihaning to'liq nomi:</span>
              <p className="text-muted-foreground mt-1">{integration.nomi}</p>
            </div>

            <div>
              <span className="font-medium">
                2. Loyihaning qisqacha tavsifi:
              </span>
              <p className="text-muted-foreground mt-1">
                {integration.tavsif ||
                  "Soliq to'lovchilari ma'lumotlarini olish"}
              </p>
            </div>

            <div>
              <span className="font-medium">3. Loyiha turi:</span>
              <p className="text-muted-foreground mt-1">Axborot tizimi</p>
            </div>

            <div>
              <span className="font-medium">
                4. Shaxsiy ma'lumotlardan foydalanadi:
              </span>
              <p className="text-muted-foreground mt-1">Ha</p>
            </div>

            <div>
              <span className="font-medium">
                5. Tashkilotning yuridik manzili:
              </span>
              <p className="text-muted-foreground mt-1">
                Manzil N° 1: Urganch shahar A.Baxodirxon ko'chasi 186-uy
              </p>
            </div>

            <div>
              <span className="font-medium">
                6. Loyihani amalga oshirish uchun mas'ul shaxslar:
              </span>
              <div className="mt-2 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">FISH:</span>
                    <span className="text-muted-foreground">
                      Radjapov Dilmurod Maqsudovich
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Telefon raqami:</span>
                    <span className="text-muted-foreground">+998975266634</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span className="text-muted-foreground">
                      Imurodmaqsudovich9393@mail.ru
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">FISH:</span>
                    <span className="text-muted-foreground">
                      Masharipov San'atbek Atanazarovich
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Telefon raqami:</span>
                    <span className="text-muted-foreground">+998914252270</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span className="text-muted-foreground">
                      sanatbek@gmail.com
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <span className="font-medium">7. Loyihaning qisqa nomi:</span>
              <p className="text-muted-foreground mt-1">{integration.nomi}</p>
            </div>

            <div>
              <span className="font-medium">
                8. Idoralararo axborot tizimi / resurs:
              </span>
              <p className="text-muted-foreground mt-1">Ha</p>
            </div>

            <div>
              <span className="font-medium">
                9. Tizim / resurs mavjud va joriy etilgan:
              </span>
              <p className="text-muted-foreground mt-1">Yo'q</p>
            </div>
          </div>
        </div>
      </div>

      {/* II. Asosiy texnik xususiyatlar */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          II. Asosiy texnik xususiyatlar haqida ma'lumotlar
        </h2>
        <div className="space-y-4">
          <div>
            <span className="font-medium">
              13. Loyiha-texnik hujjatlarini ishlab chiquvchi:
            </span>
            <p className="text-muted-foreground">Urganch shahar hokimligi</p>
          </div>

          <div>
            <span className="font-medium">
              14. Elektron shaklga o'tkaziladigan xizmatlar ro'yxati:
            </span>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Fuqarolar murojaatlarini yuborish</li>
              <li>Davlat xizmatlarini onlayn olish</li>
              <li>Shahar boshqaruviga qo'shilish</li>
            </ul>
          </div>

          <div>
            <span className="font-medium">
              15. Axborot tizimining asosiy quyi tizimlari:
            </span>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Administratorik quyi tizimi</li>
              <li>Modul Foydalanuvchilarni boshqarish</li>
              <li>Modul Xizmatlar katalogi</li>
              <li>Modul Murojaatlar boshqaruvi</li>
              <li>Modul Hisobotlar</li>
              <li>Modul Integratsiya</li>
              <li>Modul Xavfsizlik</li>
              <li>Modul Monitoring</li>
              <li>Modul Analytics</li>
            </ul>
          </div>

          <div>
            <span className="font-medium">
              16. Boshqa axborot tizimlari bilan o'zaro hamkorligi:
            </span>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>
                Qurilish va uy-joy kommunal xo'jaligi vazirligining axborot
                tizimi
              </li>
              <li>Transport vazirligining axborot tizimi</li>
              <li>
                Atrof-muhitni muhofaza qilish vazirligining axborot tizimi
              </li>
              <li>Iqtisodiyot va moliya vazirligining axborot tizimi</li>
              <li>Davlat statistika qo'mitasining axborot tizimi</li>
              <li>Davlat soliq qo'mitasining axborot tizimi</li>
              <li>Davlat bojxona qo'mitasining axborot tizimi</li>
              <li>Davlat xavfsizlik xizmatining axborot tizimi</li>
              <li>Ichki ishlar vazirligining axborot tizimi</li>
              <li>Adliya vazirligining axborot tizimi</li>
              <li>Ta'lim vazirligining axborot tizimi</li>
              <li>Sog'liqni saqlash vazirligining axborot tizimi</li>
              <li>Mehnat vazirligining axborot tizimi</li>
              <li>Ijtimoiy himoya vazirligining axborot tizimi</li>
              <li>Madaniyat vazirligining axborot tizimi</li>
              <li>Sport vazirligining axborot tizimi</li>
              <li>Turizm va madaniy meros vazirligining axborot tizimi</li>
            </ul>
          </div>

          <div>
            <span className="font-medium">
              17. Amaliy ma'lumotnomalar va klassifikatorlar:
            </span>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>
                Davlat axborot resurslari va axborot tizimlari klassifikatori
              </li>
              <li>Fuqarolarning shaxsiy ma'lumotlari klassifikatori</li>
              <li>Davlat xizmatlari katalogi</li>
              <li>Davlat organlari va tashkilotlari ro'yxati</li>
              <li>Hududiy birliklar klassifikatori</li>
              <li>Iqtisodiy faoliyat turlari klassifikatori</li>
              <li>Kasb-hunarlar klassifikatori</li>
              <li>Ta'lim muassasalari klassifikatori</li>
            </ul>
          </div>

          <div>
            <span className="font-medium">
              18. Ma'lumotlar bazasida ishlatiladigan yagona identifikator:
            </span>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>ЖШИР - Jismoniy shaxsning shaxsiy identifikatsiya raqami</li>
              <li>ЮШИР - Yuridik shaxsning shaxsiy identifikatsiya raqami</li>
            </ul>
          </div>
        </div>
      </div>

      {/* III. Yaratish, foydalanish va foydalanishdan chiqarish */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          III. Yaratish, foydalanish va foydalanishdan chiqarish haqidagi
          ma'lumotlar
        </h2>
        <div className="space-y-4">
          <div>
            <span className="font-medium">
              19. Autsorsing xizmatlaridan foydalanadi:
            </span>
            <p className="text-muted-foreground">Ha</p>
          </div>

          <div>
            <span className="font-medium">
              20. Axborot tizimini ishlab chiquvchi:
            </span>
            <p className="text-muted-foreground">
              Yaratuvchi nomi: Mustafo software MChJ
              <br />
              Ishlab chiqish jarayonini boshlash va yakunlash haqidagi hujjat:
              2025-yil 1-maydagi 001-sonli shartnoma
            </p>
          </div>

          <div>
            <span className="font-medium">
              21. «Kiberxavfsizlik markazi» ekspertizasi:
            </span>
            <p className="text-muted-foreground">
              2025-yil 8-iyuldagi kiberxavfsizlik markazi bilan 2025-yil
              21-avgustdagi 665-sonli TZ
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConceptContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">II. Konsepsiya</h2>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Bu bo'limda loyihaning konsepsiyasi va maqsadlari haqida batafsil
          ma'lumot beriladi.
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Konsepsiya ma'lumotlari hali yuklanmagan. Ma'lumotlar qo'shilgandan
            so'ng bu yerda ko'rsatiladi.
          </p>
        </div>
      </div>
    </div>
  );

  const renderTechnicalContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">III. Texnik topshiriq</h2>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Bu bo'limda loyihaning texnik topshirig'i va texnik talablari haqida
          ma'lumot beriladi.
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Texnik topshiriq ma'lumotlari hali yuklanmagan. Ma'lumotlar
            qo'shilgandan so'ng bu yerda ko'rsatiladi.
          </p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "concept":
        return renderConceptContent();
      case "technical":
        return renderTechnicalContent();
      default:
        return renderPassportContent();
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Orqaga qaytish
              </Button>
              <Badge
                className={cn("text-sm", statusColors[integration.status])}
              >
                {integration.status}
              </Badge>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {integration.nomi}
              </h1>
              <p className="text-muted-foreground">
                Markaziy Bank va vazirliklar o'rtasidagi integratsiya
              </p>
            </div>
          </div>

          {renderContent()}
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6 max-h-screen overflow-y-auto sticky top-6">
          {/* Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ma'lumotnoma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Ro'yxatga olingan raqami:</span>
                <span className="text-muted-foreground font-mono">
                  {integration.id}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Yaratilgan sana:</span>
                <span className="text-muted-foreground">
                  {formatDate(integration.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Tashkilot:</span>
                <span className="text-muted-foreground">
                  {integration.vazirlik}
                </span>
              </div>

              <Separator />

              <div>
                <span className="font-medium">
                  Loyihani amalga oshirish uchun mas'ul shaxslar:
                </span>
                <div className="mt-2 space-y-2 text-sm">
                  <div>
                    <span className="font-medium">FISH:</span>
                    <p className="text-muted-foreground">Admin User</p>
                  </div>
                  <div>
                    <span className="font-medium">Telefon raqami:</span>
                    <p className="text-muted-foreground">+998901234567</p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p className="text-muted-foreground">admin@example.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Structure Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loyiha tuzilmasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {projectStructure.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(item.id)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
