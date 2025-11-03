"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Upload, X, Plus, Loader2 } from "lucide-react";
import { supabaseUtils } from "@/lib/supabaseUtils";
import { supabase } from "@/lib/supabase";
import type { Integration, IntegrationTab } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function EditIntegrationPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const role = user?.role as "Administrator" | "Operator" | "Viewer" | undefined;

  useEffect(() => {
    if (!authLoading && !hasPermission(role, "canEditIntegrations")) {
      toast.error("Sizda integratsiyalarni tahrirlash ruxsati yo'q");
      router.replace("/integrations");
    }
  }, [user, authLoading, role, router]);
  const [activeTab, setActiveTab] = useState("passport");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTabName, setNewTabName] = useState("");
  const [selectedColumnKey, setSelectedColumnKey] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTabConfirmOpen, setDeleteTabConfirmOpen] = useState(false);
  const [deleteFileConfirmOpen, setDeleteFileConfirmOpen] = useState(false);
  const [tabToDelete, setTabToDelete] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<{
    tabId: string;
    fileId: string;
  } | null>(null);
  const [dynamicTabs, setDynamicTabs] = useState<
    Array<{
      id: string;
      name: string;
      columnKey: string;
      title: string;
      description: string;
      files: Array<{
        id: string;
        file: File | null;
        url?: string;
        name?: string;
        size?: number;
        type?: string;
      }>;
    }>
  >([]);
  const [formData, setFormData] = useState({
    // Yangi 18 column struktura
    axborotTizimiNomi: "",
    integratsiyaUsuli: "",
    malumotNomi: "",
    tashkilotNomiVaShakli: "",
    asosiyMaqsad: "",
    normativHuquqiyHujjat: "",
    texnologikYoriknomaMavjudligi: "",
    malumotFormati: "JSON" as "JSON" | "XML" | "CSV" | "SOAP" | "REST API",
    maqlumotAlmashishSharti: "",
    yangilanishDavriyligi: "",
    malumotHajmi: "",
    aloqaKanali: "",
    oxirgiUzatishVaqti: "",
    markaziyBankAloqa: "",
    hamkorAloqa: "",
    status: "faol" as "faol" | "testda" | "rejalashtirilgan" | "muammoli",
    izoh: "",
  });

  // Load integration data
  useEffect(() => {
    const loadIntegration = async () => {
      try {
        setIsLoading(true);
        const integration = await supabaseUtils.getIntegration(
          params.id as string
        );
        if (integration) {
          setFormData({
            axborotTizimiNomi: integration.axborotTizimiNomi || "",
            integratsiyaUsuli: integration.integratsiyaUsuli || "",
            malumotNomi: integration.malumotNomi || "",
            tashkilotNomiVaShakli: integration.tashkilotNomiVaShakli || "",
            asosiyMaqsad: integration.asosiyMaqsad || "",
            normativHuquqiyHujjat: integration.normativHuquqiyHujjat || "",
            texnologikYoriknomaMavjudligi:
              integration.texnologikYoriknomaMavjudligi || "",
            malumotFormati: integration.malumotFormati || "JSON",
            maqlumotAlmashishSharti: integration.maqlumotAlmashishSharti || "",
            yangilanishDavriyligi: integration.yangilanishDavriyligi || "",
            malumotHajmi: integration.malumotHajmi || "",
            aloqaKanali: integration.aloqaKanali || "",
            oxirgiUzatishVaqti: integration.oxirgiUzatishVaqti || "",
            markaziyBankAloqa: integration.markaziyBankAloqa || "",
            hamkorAloqa: integration.hamkorAloqa || "",
            status: integration.status || "faol",
            izoh: integration.izoh || "",
          });

          // Load dynamic tabs
          if (integration.dynamicTabs && integration.dynamicTabs.length > 0) {
            setDynamicTabs(
              integration.dynamicTabs.map((tab) => ({
                id: tab.id,
                name: tab.name,
                columnKey: tab.columnKey,
                title: tab.title || "",
                description: tab.description || "",
                files: tab.files.map((file) => ({
                  id: file.id,
                  file: null,
                  url: file.url,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                })),
              }))
            );
          }
        }
      } catch (error) {
        console.error("Integratsiyani yuklashda xatolik:", error);
        toast.error("Integratsiyani yuklashda xatolik yuz berdi!");
        router.push("/integrations");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadIntegration();
    }
  }, [params.id, router]);

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDynamicTabFieldChange = (
    tabId: string,
    field: string,
    value: string
  ) => {
    setDynamicTabs((prev) =>
      prev.map((tab) => (tab.id === tabId ? { ...tab, [field]: value } : tab))
    );
  };

  const handleFileChange = (
    tabId: string,
    fileId: string,
    file: File | null
  ) => {
    setDynamicTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              files: tab.files.map((f) =>
                f.id === fileId ? { ...f, file } : f
              ),
            }
          : tab
      )
    );
  };

  const handleAddFileInput = (tabId: string) => {
    setDynamicTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              files: [
                ...tab.files,
                {
                  id: `file_${Date.now()}`,
                  file: null,
                },
              ],
            }
          : tab
      )
    );
  };

  const handleRemoveFileInput = (tabId: string, fileId: string) => {
    setFileToDelete({ tabId, fileId });
    setDeleteFileConfirmOpen(true);
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    
    // Agar file Supabase'da mavjud bo'lsa (id mavjud va temp id emas), backend'dan ham o'chirish
    const tab = dynamicTabs.find((t) => t.id === fileToDelete.tabId);
    const file = tab?.files.find((f) => f.id === fileToDelete.fileId);
    
    if (file?.id && !file.id.startsWith("file_")) {
      try {
        const { error } = await supabase
          .from("integration_files")
          .delete()
          .eq("id", file.id);
        
        if (error) throw error;
      } catch (error) {
        console.error("Faylni o'chirishda xatolik:", error);
        toast.error("Faylni o'chirishda xatolik yuz berdi!");
        setDeleteFileConfirmOpen(false);
        setFileToDelete(null);
        return;
      }
    }

    setDynamicTabs((prev) =>
      prev.map((tab) =>
        tab.id === fileToDelete.tabId
          ? {
              ...tab,
              files: tab.files.filter((f) => f.id !== fileToDelete.fileId),
            }
          : tab
      )
    );
    setDeleteFileConfirmOpen(false);
    setFileToDelete(null);
    toast.success("Fayl muvaffaqiyatli o'chirildi!");
  };

  const handleAddNewTab = () => {
    if (newTabName.trim() && selectedColumnKey) {
      const newTab = {
        id: `tab_${Date.now()}`,
        name: newTabName.trim(),
        columnKey: selectedColumnKey,
        title: "",
        description: "",
        files: [
          {
            id: `file_${Date.now()}`,
            file: null,
          },
        ],
      };
      setDynamicTabs((prev) => [...prev, newTab]);
      setNewTabName("");
      setSelectedColumnKey("");
      setIsModalOpen(false);
      setActiveTab(newTab.id);
    }
  };

  // Column options for select
  const columnOptions = [
    {
      value: "axborotTizimiNomi",
      label: "Axborot tizimi yoki resursning to'liq nomi",
    },
    {
      value: "integratsiyaUsuli",
      label: "Integratsiyani amalga oshirish usuli",
    },
    {
      value: "malumotNomi",
      label: "Uzatiladigan/qabul qilinadigan ma'lumot nomi",
    },
    {
      value: "tashkilotNomiVaShakli",
      label: "Integratsiya qilingan tashkilot nomi va shakli",
    },
    { value: "asosiyMaqsad", label: "Integratsiyadan asosiy maqsad" },
    { value: "normativHuquqiyHujjat", label: "Normativ-huquqiy hujjat" },
    {
      value: "texnologikYoriknomaMavjudligi",
      label: "Texnologik yo'riqnoma mavjudligi",
    },
    { value: "maqlumotAlmashishSharti", label: "Ma'lumot almashish sharti" },
    {
      value: "yangilanishDavriyligi",
      label: "Ma'lumot yangilanish davriyligi",
    },
    { value: "malumotHajmi", label: "Ma'lumot hajmi" },
    { value: "aloqaKanali", label: "Hamkor tashkilot bilan aloqa kanali" },
    {
      value: "oxirgiUzatishVaqti",
      label: "So'nggi muvaffaqiyatli uzatish vaqti",
    },
    {
      value: "markaziyBankAloqa",
      label: "Markaziy bank tomonidan texnik aloqa shaxsi",
    },
    {
      value: "hamkorAloqa",
      label: "Hamkor tashkilot tomonidan texnik aloqa shaxsi",
    },
    { value: "izoh", label: "Izoh / qo'shimcha ma'lumot" },
  ];

  const handleRemoveTab = (tabId: string) => {
    setTabToDelete(tabId);
    setDeleteTabConfirmOpen(true);
  };

  const confirmDeleteTab = () => {
    if (!tabToDelete) return;
    setDynamicTabs((prev) => prev.filter((tab) => tab.id !== tabToDelete));
    if (activeTab === tabToDelete) {
      setActiveTab("passport");
    }
    setDeleteTabConfirmOpen(false);
    setTabToDelete(null);
  };

  const handleSave = async () => {
    // Ma'lumotlarni tekshirish
    if (
      !formData.axborotTizimiNomi ||
      !formData.integratsiyaUsuli ||
      !formData.malumotNomi ||
      !formData.tashkilotNomiVaShakli ||
      !formData.asosiyMaqsad ||
      !formData.normativHuquqiyHujjat ||
      !formData.malumotFormati ||
      !formData.status
    ) {
      toast.error("Barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    setIsSaving(true);
    try {
      // Dynamic tablarni tayyorlash
      // Fayllarni base64 formatda saqlash
      const processFiles = async (files: any[]) => {
        const processedFiles = [];
        for (const file of files) {
          if (file.file) {
            // Yangi fayl yuklangan
            const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file.file);
            });
            processedFiles.push({
              name: file.file.name,
              size: file.file.size,
              type: file.file.type,
              url: base64,
            });
          } else if (file.url && !file.file) {
            // Mavjud fayl saqlanadi
            processedFiles.push({
              name: file.name || "",
              size: file.size || 0,
              type: file.type || "",
              url: file.url,
            });
          }
        }
        return processedFiles;
      };

      const preparedDynamicTabs = await Promise.all(
        dynamicTabs.map(async (tab: any) => ({
          name: tab.name,
          columnKey: tab.columnKey,
          title: tab.title,
          description: tab.description,
          files: await processFiles(tab.files),
          id: tab.id, // Tab id'ni saqlash
        }))
      );

      // Supabase'ga yangilash
      const updatedIntegration = await supabaseUtils.updateIntegration(
        params.id as string,
        {
          ...formData,
          dynamicTabs: preparedDynamicTabs.map((tab) => ({
            name: tab.name,
            columnKey: tab.columnKey,
            title: tab.title,
            description: tab.description,
            files: tab.files.map((file: any) => ({
              id: file.id || undefined, // File id'ni saqlash
              name: file.name,
              size: file.size,
              type: file.type,
              url: file.url,
            })),
            id: tab.id,
          })),
        }
      );

      if (!updatedIntegration) {
        toast.error("Yangilashda xatolik yuz berdi!");
        return;
      }

      toast.success("Integratsiya muvaffaqiyatli yangilandi!");

      // Integrations listiga qaytish
      router.push("/integrations");
    } catch (error) {
      console.error("Yangilashda xatolik:", error);
      toast.error("Yangilashda xatolik yuz berdi!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/integrations");
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hasPermission(role, "canEditIntegrations")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Ruxsat yo'q</p>
          <p className="text-muted-foreground">
            Sizda integratsiyalarni tahrirlash ruxsati yo'q
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderPassportContent = () => (
    <div className="space-y-8">
      {/* I. Integratsiya ma'lumotlari */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
            I
          </div>
          <h3 className="text-lg font-semibold">Integratsiya ma'lumotlari</h3>
        </div>

        {/* Select fields row - Ma'lumot formati va Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="malumotFormati">Ma'lumot formati *</Label>
            <Select
              value={formData.malumotFormati}
              onValueChange={(value) =>
                handleInputChange(
                  "malumotFormati",
                  value as "JSON" | "XML" | "CSV" | "SOAP" | "REST API"
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ma'lumot formatini tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JSON">JSON</SelectItem>
                <SelectItem value="XML">XML</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
                <SelectItem value="SOAP">SOAP</SelectItem>
                <SelectItem value="REST API">REST API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Integratsiya holati / statusi *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                handleInputChange(
                  "status",
                  value as "faol" | "testda" | "rejalashtirilgan" | "muammoli"
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Statusni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="faol">Faol</SelectItem>
                <SelectItem value="testda">Testda</SelectItem>
                <SelectItem value="rejalashtirilgan">
                  Rejalashtirilgan
                </SelectItem>
                <SelectItem value="muammoli">Muammoli</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Asosiy input fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="axborotTizimiNomi">
                Axborot tizimi yoki resursning to'liq nomi (yoki interfeys) *
              </Label>
              <Textarea
                id="axborotTizimiNomi"
                value={formData.axborotTizimiNomi}
                onChange={(e) =>
                  handleInputChange("axborotTizimiNomi", e.target.value)
                }
                placeholder="Axborot tizimi nomini kiriting"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="integratsiyaUsuli">
                Integratsiyani amalga oshirish usuli *
              </Label>
              <Textarea
                id="integratsiyaUsuli"
                value={formData.integratsiyaUsuli}
                onChange={(e) =>
                  handleInputChange("integratsiyaUsuli", e.target.value)
                }
                placeholder="Idoralararo integrallashuv platformasi orqali yoki to'g'ridan to'g'ri"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="malumotNomi">
                Uzatiladigan/qabul qilinadigan ma'lumot nomi *
              </Label>
              <Textarea
                id="malumotNomi"
                value={formData.malumotNomi}
                onChange={(e) =>
                  handleInputChange("malumotNomi", e.target.value)
                }
                placeholder="Ma'lumot nomini kiriting"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tashkilotNomiVaShakli">
                Integratsiya qilingan tashkilot nomi va shakli *
              </Label>
              <Textarea
                id="tashkilotNomiVaShakli"
                value={formData.tashkilotNomiVaShakli}
                onChange={(e) =>
                  handleInputChange("tashkilotNomiVaShakli", e.target.value)
                }
                placeholder="Tashkilot nomi va shakli (davlat / xususiy)"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="normativHuquqiyHujjat">
                Normativ-huquqiy hujjat *
              </Label>
              <Textarea
                id="normativHuquqiyHujjat"
                value={formData.normativHuquqiyHujjat}
                onChange={(e) =>
                  handleInputChange("normativHuquqiyHujjat", e.target.value)
                }
                placeholder="Normativ-huquqiy hujjat nomini kiriting"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="texnologikYoriknomaMavjudligi">
                Axborot almashinuvi bo'yicha texnologik yo'riqnoma mavjudligi
              </Label>
              <Textarea
                id="texnologikYoriknomaMavjudligi"
                value={formData.texnologikYoriknomaMavjudligi}
                onChange={(e) =>
                  handleInputChange(
                    "texnologikYoriknomaMavjudligi",
                    e.target.value
                  )
                }
                placeholder="Texnologik yo'riqnoma mavjudligi"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maqlumotAlmashishSharti">
                Ma'lumot almashish sharti
              </Label>
              <Textarea
                id="maqlumotAlmashishSharti"
                value={formData.maqlumotAlmashishSharti}
                onChange={(e) =>
                  handleInputChange("maqlumotAlmashishSharti", e.target.value)
                }
                placeholder="So'rov-javob, push, fayl almashinuvi"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yangilanishDavriyligi">
                Ma'lumot yangilanish davriyligi
              </Label>
              <Textarea
                id="yangilanishDavriyligi"
                value={formData.yangilanishDavriyligi}
                onChange={(e) =>
                  handleInputChange("yangilanishDavriyligi", e.target.value)
                }
                placeholder="Real vaqt, kunlik, haftalik, oylik va hokazo"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="malumotHajmi">Ma'lumot hajmi</Label>
              <Textarea
                id="malumotHajmi"
                value={formData.malumotHajmi}
                onChange={(e) =>
                  handleInputChange("malumotHajmi", e.target.value)
                }
                placeholder="Kunlik / oylik MB yoki GB"
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aloqaKanali">
                Hamkor tashkilot bilan aloqa kanali
              </Label>
              <Textarea
                id="aloqaKanali"
                value={formData.aloqaKanali}
                onChange={(e) =>
                  handleInputChange("aloqaKanali", e.target.value)
                }
                placeholder="API, VPN, server va hokazo"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oxirgiUzatishVaqti">
                So'nggi muvaffaqiyatli uzatish vaqti
              </Label>
              <Textarea
                id="oxirgiUzatishVaqti"
                value={formData.oxirgiUzatishVaqti}
                onChange={(e) =>
                  handleInputChange("oxirgiUzatishVaqti", e.target.value)
                }
                placeholder="Tizimdan online olib beriladi"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="markaziyBankAloqa">
                Markaziy bank tomonidan texnik aloqa shaxsi
              </Label>
              <Textarea
                id="markaziyBankAloqa"
                value={formData.markaziyBankAloqa}
                onChange={(e) =>
                  handleInputChange("markaziyBankAloqa", e.target.value)
                }
                placeholder="F.I.Sh, telefon, e-mail"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hamkorAloqa">
                Hamkor tashkilot tomonidan texnik aloqa shaxsi
              </Label>
              <Textarea
                id="hamkorAloqa"
                value={formData.hamkorAloqa}
                onChange={(e) =>
                  handleInputChange("hamkorAloqa", e.target.value)
                }
                placeholder="F.I.Sh, telefon, e-mail"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="izoh">Izoh / qo'shimcha ma'lumot</Label>
              <Textarea
                id="izoh"
                value={formData.izoh}
                onChange={(e) => handleInputChange("izoh", e.target.value)}
                placeholder="Qo'shimcha ma'lumot"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Asosiy maqsad textarea */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asosiyMaqsad">
              Integratsiyadan asosiy maqsad *
            </Label>
            <Textarea
              id="asosiyMaqsad"
              value={formData.asosiyMaqsad}
              onChange={(e) =>
                handleInputChange("asosiyMaqsad", e.target.value)
              }
              placeholder="Integratsiyadan asosiy maqsadni kiriting"
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDynamicTabContent = (tab: {
    id: string;
    name: string;
    title: string;
    description: string;
    files: Array<{
      id: string;
      file: File | null;
      url?: string;
      name?: string;
      size?: number;
      type?: string;
    }>;
  }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{tab.name}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleRemoveTab(tab.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor={`${tab.id}_title`}>Sarlavha *</Label>
          <Textarea
            id={`${tab.id}_title`}
            value={tab.title}
            onChange={(e) =>
              handleDynamicTabFieldChange(tab.id, "title", e.target.value)
            }
            placeholder="Sarlavha kiriting"
            rows={2}
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <Label htmlFor={`${tab.id}_description`}>Tavsif *</Label>
          <Textarea
            id={`${tab.id}_description`}
            value={tab.description}
            onChange={(e) =>
              handleDynamicTabFieldChange(tab.id, "description", e.target.value)
            }
            placeholder="Tavsif kiriting"
            rows={3}
          />
        </div>

        {/* File Inputs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Fayllar</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddFileInput(tab.id)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Fayl qo'shish
            </Button>
          </div>

          {tab.files.map((fileInput, index) => (
            <div key={fileInput.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${fileInput.id}_file`}>Fayl {index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFileInput(tab.id, fileInput.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-2">
                {fileInput.file ? (
                  <div className="flex items-center justify-between p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                          <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {fileInput.file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(fileInput.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFileInput(tab.id, fileInput.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : fileInput.url ? (
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <Upload className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {fileInput.name || "Mavjud fayl"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {fileInput.size
                            ? `${(fileInput.size / 1024 / 1024).toFixed(2)} MB`
                            : "Mavjud fayl"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFileInput(tab.id, fileInput.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                    <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`${fileInput.id}_file`}
                        className="cursor-pointer"
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">
                          Fayl yuklash uchun bosing
                        </span>
                      </Label>
                      <input
                        id={`${fileInput.id}_file`}
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileChange(tab.id, fileInput.id, file);
                        }}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        yoki faylni bu yerga sudrab tashlang
                      </p>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        PDF, DOC, DOCX, TXT formatlarida • Maksimal 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Integratsiyani tahrirlash
          </h1>
          <p className="text-muted-foreground">
            Integratsiya ma'lumotlarini yangilang
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Orqaga qaytish
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Integratsiya ma'lumotlari</CardTitle>
          <CardDescription>
            Barcha kerakli ma'lumotlarni yangilang va fayllarni yuklang
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="flex w-full">
              <TabsTrigger value="passport">Pasport</TabsTrigger>
              {dynamicTabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.name}
                </TabsTrigger>
              ))}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-9 px-3"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Yangi tab qo'shish</DialogTitle>
                    <DialogDescription>
                      Tab nomini kiriting va qaysi column uchun tab
                      ochilayotganini tanlang
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="tab-name">Tab nomi *</Label>
                      <Input
                        id="tab-name"
                        value={newTabName}
                        onChange={(e) => setNewTabName(e.target.value)}
                        placeholder="Tab nomini kiriting"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="column-select">Column tanlash *</Label>
                      <Select
                        value={selectedColumnKey}
                        onValueChange={setSelectedColumnKey}
                      >
                        <SelectTrigger id="column-select" className="w-full">
                          <SelectValue placeholder="Column tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {columnOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsModalOpen(false);
                        setNewTabName("");
                        setSelectedColumnKey("");
                      }}
                    >
                      Bekor qilish
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAddNewTab}
                      disabled={!newTabName.trim() || !selectedColumnKey}
                    >
                      Qo'shish
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsList>

            <TabsContent value="passport" className="space-y-4">
              {renderPassportContent()}
            </TabsContent>

            {dynamicTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-4">
                {renderDynamicTabContent(tab)}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
          Bekor qilish
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Yangilanmoqda...
            </>
          ) : (
            "Saqlash"
          )}
        </Button>
      </div>

      {/* Delete Tab Confirmation Dialog */}
      <AlertDialog
        open={deleteTabConfirmOpen}
        onOpenChange={setDeleteTabConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tab'ni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu tab'ni o'chirishni tasdiqlaysizmi? Barcha tab ichidagi
              ma'lumotlar va fayllar o'chiriladi. Bu amalni bekor qilib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTab}
              className="bg-red-600 hover:bg-red-700"
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete File Confirmation Dialog */}
      <AlertDialog
        open={deleteFileConfirmOpen}
        onOpenChange={setDeleteFileConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Faylni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu faylni o'chirishni tasdiqlaysizmi? Bu amalni bekor qilib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteFile}
              className="bg-red-600 hover:bg-red-700"
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

