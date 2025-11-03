"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { Integration, IntegrationTab } from "@/lib/types";
import { supabaseUtils } from "@/lib/supabaseUtils";
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
  faol: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  testda:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  rejalashtirilgan:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  muammoli: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const formatColors = {
  JSON: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  XML: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  CSV: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  SOAP: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "REST API":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

const defaultProjectStructure = [
  { id: "passport", label: "Pasport", active: true },
];

export default function IntegrationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
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
    const loadIntegration = async () => {
      try {
        // Supabase'dan ma'lumotlarni o'qish
        const integration = await supabaseUtils.getIntegration(
          params.id as string
        );
        setIntegration(integration);
      } catch (error) {
        console.error("Integratsiya yuklashda xatolik:", error);
        setIntegration(null);
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

  // URL'dan tab parametrini o'qish va tab'ni ochish
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && integration?.dynamicTabs) {
      const tabExists = integration.dynamicTabs.some(
        (tab) => tab.id === tabParam
      );
      if (tabExists) {
        setActiveTab(tabParam);
        // Tab o'zgarganda tepaga skroll qilish
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }, [searchParams, integration]);

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
              <span className="font-medium">
                Axborot tizimi yoki resursning to'liq nomi (yoki interfeys):
              </span>
              <p className="text-muted-foreground mt-1">
                {integration.axborotTizimiNomi || "Kiritilmagan"}
              </p>
            </div>

            <div>
              <span className="font-medium">
                Integratsiyani amalga oshirish usuli:
              </span>
              <p className="text-muted-foreground mt-1">
                {integration.integratsiyaUsuli || "Kiritilmagan"}
              </p>
            </div>

            <div>
              <span className="font-medium">
                Uzatiladigan/qabul qilinadigan ma'lumot nomi:
              </span>
              <p className="text-muted-foreground mt-1">
                {integration.malumotNomi || "Kiritilmagan"}
              </p>
            </div>

            <div>
              <span className="font-medium">
                Integratsiya qilingan tashkilot nomi va shakli:
              </span>
              <p className="text-muted-foreground mt-1">
                {integration.tashkilotNomiVaShakli || "Kiritilmagan"}
              </p>
            </div>

            <div>
              <span className="font-medium">Normativ-huquqiy hujjat:</span>
              <p className="text-muted-foreground mt-1">
                {integration.normativHuquqiyHujjat || "Kiritilmagan"}
              </p>
            </div>

            <div>
              <span className="font-medium">
                Axborot almashinuvi bo'yicha texnologik yo'riqnoma mavjudligi:
              </span>
              <p className="text-muted-foreground mt-1">
                {integration.texnologikYoriknomaMavjudligi || "Kiritilmagan"}
              </p>
            </div>

            <div>
              <span className="font-medium block mb-2">Ma'lumot formati:</span>
              <Badge
                className={cn(
                  formatColors[integration.malumotFormati] ||
                    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                )}
              >
                {integration.malumotFormati}
              </Badge>
            </div>

            <div>
              <span className="font-medium">Ma'lumot almashish sharti:</span>
              <p className="text-muted-foreground mt-1">
                {integration.maqlumotAlmashishSharti || "Kiritilmagan"}
              </p>
            </div>

            <div>
              <span className="font-medium">
                Ma'lumot yangilanish davriyligi:
              </span>
              <p className="text-muted-foreground mt-1">
                {integration.yangilanishDavriyligi || "Kiritilmagan"}
              </p>
            </div>

            <div>
              <span className="font-medium">Ma'lumot hajmi:</span>
              <p className="text-muted-foreground mt-1">
                {integration.malumotHajmi || "Kiritilmagan"}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <span className="font-medium">
                Hamkor tashkilot bilan aloqa kanali:
              </span>
              <p className="text-muted-foreground mt-1">
                {integration.aloqaKanali || "Kiritilmagan"}
              </p>
            </div>

            <div>
              <span className="font-medium">
                So'nggi muvaffaqiyatli uzatish vaqti:
              </span>
              <p className="text-muted-foreground mt-1">
                {integration.oxirgiUzatishVaqti || "Kiritilmagan"}
              </p>
            </div>

            <div>
              <span className="font-medium">
                Markaziy bank tomonidan texnik aloqa shaxsi:
              </span>
              <p className="text-muted-foreground mt-1">
                {integration.markaziyBankAloqa || "Kiritilmagan"}
              </p>
            </div>

            <div>
              <span className="font-medium">
                Hamkor tashkilot tomonidan texnik aloqa shaxsi:
              </span>
              <p className="text-muted-foreground mt-1">
                {integration.hamkorAloqa || "Kiritilmagan"}
              </p>
            </div>

            <div>
              <span className="font-medium block mb-2">
                Integratsiya holati / statusi:
              </span>
              <Badge className={cn(statusColors[integration.status])}>
                {integration.status}
              </Badge>
            </div>

            <div>
              <span className="font-medium">Izoh / qo'shimcha ma'lumot:</span>
              <p className="text-muted-foreground mt-1">
                {integration.izoh || "Kiritilmagan"}
              </p>
            </div>

            <div>
              <span className="font-medium">Yaratilgan sana:</span>
              <p className="text-muted-foreground mt-1">
                {formatDate(integration.createdAt)}
              </p>
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

      {/* Asosiy maqsad - Separate row */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Integratsiyadan asosiy maqsad</h2>
        <div className="space-y-4">
          <div>
            <span className="font-medium">Integratsiyadan asosiy maqsad:</span>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              {integration.asosiyMaqsad || "Asosiy maqsad kiritilmagan"}
            </p>
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
                className={cn("text-sm mt-1", statusColors[integration.status])}
              >
                {integration.status}
              </Badge>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {integration.axborotTizimiNomi || "Integratsiya"}
              </h1>
              <p className="text-muted-foreground">
                {integration.tashkilotNomiVaShakli ||
                  "Tashkilot nomi va shakli kiritilmagan"}
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
