"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Integration, IntegrationTab } from "@/lib/types";
import { mockIntegrations } from "@/lib/mock-data";
import { localStorageUtils } from "@/lib/localStorage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Hash,
  FileText,
  User,
  Phone,
  Mail,
  FileCheck,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

const statusColors = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Test: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

const defaultProjectStructure = [
  { id: "passport", label: "Pasport", active: true },
];

export default function IntegrationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("passport");
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectStructure, setProjectStructure] = useState(
    defaultProjectStructure
  );

  // Tab o'zgarganida tepaga skroll qilish
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Darhol skroll qilish
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  // Orqaga qaytish funksiyasi
  const handleGoBack = () => {
    try {
      // Avval window.history.back() ni sinab ko'rish
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Agar history bo'sh bo'lsa, integratsiyalar sahifasiga o'tish
        router.push("/integrations");
      }
    } catch (error) {
      // Agar window.history.back() ishlamasa, router.back() ni sinab ko'rish
      try {
        router.back();
      } catch (routerError) {
        // Agar ikkalasi ham ishlamasa, integratsiyalar sahifasiga o'tish
        console.warn(
          "Both history.back() and router.back() failed, navigating to integrations page"
        );
        router.push("/integrations");
      }
    }
  };

  useEffect(() => {
    const loadIntegration = () => {
      try {
        // LocalStorage'dan ma'lumotlarni o'qish
        const savedIntegrations = localStorageUtils.getIntegrations();

        // Agar LocalStorage'da ma'lumot yo'q bo'lsa, mock ma'lumotlarni yuklash
        if (savedIntegrations.length === 0) {
          localStorageUtils.loadMockData(mockIntegrations);
          const integration = mockIntegrations.find(
            (item) => item.id === params.id
          );
          setIntegration(integration || null);
        } else {
          const integration = savedIntegrations.find(
            (item) => item.id === params.id
          );
          setIntegration(integration || null);
        }
      } catch (error) {
        console.error("Integratsiya yuklashda xatolik:", error);
        // Xatolik bo'lsa, mock ma'lumotlardan qidirish
        const integration = mockIntegrations.find(
          (item) => item.id === params.id
        );
        setIntegration(integration || null);
      } finally {
        setLoading(false);
      }
    };

    loadIntegration();
  }, [params.id]);

  // Integration o'zgarganda project structure'ni yangilash
  useEffect(() => {
    if (integration?.dynamicTabs && integration.dynamicTabs.length > 0) {
      const dynamicTabs = integration.dynamicTabs.map((tab) => ({
        id: tab.id,
        label: tab.name,
        active: false,
      }));
      setProjectStructure([...defaultProjectStructure, ...dynamicTabs]);
    } else {
      setProjectStructure(defaultProjectStructure);
    }
  }, [integration]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!integration) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Integratsiya topilmadi</h1>
          <p className="text-muted-foreground mb-6">
            ID: {params.id} bo'yicha integratsiya topilmadi
          </p>
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
      {/* I. Asosiy ma'lumotlar */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">I. Asosiy ma'lumotlar</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <span className="font-medium">Integratsiya nomi:</span>
              <p className="text-muted-foreground mt-1">{integration.nomi}</p>
            </div>

            <div>
              <span className="font-medium">Vazirlik/Tashkilot:</span>
              <p className="text-muted-foreground mt-1">
                {integration.vazirlik}
              </p>
            </div>

            <div>
              <span className="font-medium">Tashkilot shakli:</span>
              <p className="text-muted-foreground mt-1">
                {integration.tashkilotShakli}
              </p>
            </div>

            <div>
              <span className="font-medium">Tashkilot turi:</span>
              <p className="text-muted-foreground mt-1">
                {integration.tashkilotTuri}
              </p>
            </div>

            <div>
              <span className="font-medium">Status:</span>
              <Badge className={cn("mt-1", statusColors[integration.status])}>
                {integration.status}
              </Badge>
            </div>

            <div>
              <span className="font-medium">Yaratilgan sana:</span>
              <p className="text-muted-foreground mt-1">
                {formatDate(integration.createdAt)}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <span className="font-medium">Axborot tizimi nomi:</span>
              <p className="text-muted-foreground mt-1">
                {integration.axborotTizimiNomi}
              </p>
            </div>

            <div>
              <span className="font-medium">Ma'lumot beruvchi tashkilot:</span>
              <p className="text-muted-foreground mt-1">
                {integration.qaysiTashkilotTomondan}
              </p>
            </div>

            <div>
              <span className="font-medium">MSPD manzili:</span>
              <p className="text-muted-foreground mt-1">
                {integration.mspdManzil}
              </p>
            </div>

            <div>
              <span className="font-medium">Oylik sorovlar soni:</span>
              <p className="text-muted-foreground mt-1">
                {integration.sorovlarOrtachaOylik.toLocaleString()}
              </p>
            </div>

            <div>
              <span className="font-medium">Muddat:</span>
              <p className="text-muted-foreground mt-1">{integration.muddat}</p>
            </div>

            <div>
              <span className="font-medium">Yangilangan sana:</span>
              <p className="text-muted-foreground mt-1">
                {formatDate(integration.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Asosiy vazifasi - Separate row */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Asosiy vazifasi</h2>
        <div className="space-y-4">
          <div>
            <span className="font-medium">
              Integratsiyaning asosiy vazifasi:
            </span>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              {integration.asosiyMaqsad || "Asosiy vazifa kiritilmagan"}
            </p>
          </div>
        </div>
      </div>

      {/* Ma'lumot almashish sharti - Separate row */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Ma'lumot almashish sharti</h2>
        <div className="space-y-4">
          <div>
            <span className="font-medium">Ma'lumot almashish shartlari:</span>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              {integration.maqlumotAlmashishSharti ||
                "Ma'lumot almashish sharti kiritilmagan"}
            </p>
          </div>
        </div>
      </div>

      {/* II. Texnik xususiyatlar */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">II. Texnik xususiyatlar</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <span className="font-medium">Texnologiya:</span>
              <p className="text-muted-foreground mt-1">
                {integration.texnologiya}
              </p>
            </div>

            <div>
              <span className="font-medium">
                Texnologik yo'riqnoma mavjudligi:
              </span>
              <p className="text-muted-foreground mt-1">
                {integration.texnologikYoriknomaMavjudligi
                  ? "Mavjud"
                  : "Mavjud emas"}
              </p>
            </div>

            <div>
              <span className="font-medium">Huquqiy asos:</span>
              <p className="text-muted-foreground mt-1">
                {integration.huquqiyAsos}
              </p>
            </div>

            <div>
              <span className="font-medium">Normativ-huquqiy hujjat:</span>
              <p className="text-muted-foreground mt-1">
                {integration.normativHuquqiyHujjat}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <span className="font-medium">Sana:</span>
              <p className="text-muted-foreground mt-1">{integration.sana}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDynamicTabContent = (tab: IntegrationTab) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{tab.title}</h2>
      </div>

      <div className="space-y-4">
        {tab.description && (
          <div>
            <h4 className="font-medium mb-2">Tavsif:</h4>
            <p className="text-muted-foreground">{tab.description}</p>
          </div>
        )}

        {tab.files && tab.files.length > 0 && (
          <div>
            <h4 className="font-medium mb-4">Fayllar:</h4>
            <Accordion type="single" collapsible className="w-full">
              {tab.files.map((file, index) => (
                <AccordionItem
                  key={file.id || index}
                  value={file.id?.toString() || index.toString()}
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3 text-left">
                        <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                            {file.type}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Yuklab olish logikasi
                        }}
                        className="ml-4"
                      >
                        Yuklab olish
                      </Button>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4">
                      {file.type.startsWith("image/") ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Rasm ko'rinishi:
                          </p>
                          <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                            <img
                              src={file.url || `data:${file.type};base64,`}
                              alt={file.name}
                              className="w-full h-auto max-h-96 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const nextElement = e.currentTarget
                                  .nextElementSibling as HTMLElement;
                                if (nextElement) {
                                  nextElement.style.display = "block";
                                }
                              }}
                            />
                            <div className="hidden p-8 text-center text-gray-500 dark:text-gray-400">
                              <FileText className="h-12 w-12 mx-auto mb-2" />
                              <p>Rasm yuklanmadi</p>
                            </div>
                          </div>
                        </div>
                      ) : file.type === "application/pdf" ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            PDF ko'rinishi:
                          </p>
                          <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                            <iframe
                              src={file.url || `data:${file.type};base64,`}
                              className="w-full h-[1000px]"
                              title={file.name}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const nextElement = e.currentTarget
                                  .nextElementSibling as HTMLElement;
                                if (nextElement) {
                                  nextElement.style.display = "block";
                                }
                              }}
                            />
                            <div className="hidden p-8 text-center text-gray-500 dark:text-gray-400">
                              <FileText className="h-12 w-12 mx-auto mb-2" />
                              <p>PDF yuklanmadi</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Fayl turi:
                          </p>
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                            <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-gray-600 dark:text-gray-400">
                              {file.type} faylini ko'rish uchun yuklab oling
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    // Dynamic tablarni tekshirish
    if (integration?.dynamicTabs) {
      const dynamicTab = integration.dynamicTabs.find(
        (tab) => tab.id === activeTab
      );
      if (dynamicTab) {
        return renderDynamicTabContent(dynamicTab);
      }
    }

    // Faqat passport content
    return renderPassportContent();
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
                onClick={handleGoBack}
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

          {/* Tabs Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {projectStructure.map((item) => {
                  const isActive = activeTab === item.id;
                  const getTabIcon = (tabId: string) => {
                    switch (tabId) {
                      case "passport":
                        return <FileCheck className="h-4 w-4" />;
                      default:
                        return <FileText className="h-4 w-4" />;
                    }
                  };

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={cn(
                        "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                        isActive
                          ? "border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
                      )}
                    >
                      <span
                        className={cn(
                          "mr-2 transition-colors duration-200",
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
                        )}
                      >
                        {getTabIcon(item.id)}
                      </span>
                      {item.label}
                      {isActive && (
                        <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
}
