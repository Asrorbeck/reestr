"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { localStorageUtils } from "@/lib/localStorage";

export default function NewIntegrationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("passport");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTabName, setNewTabName] = useState("");
  const [dynamicTabs, setDynamicTabs] = useState<
    Array<{
      id: string;
      name: string;
      title: string;
      description: string;
      files: Array<{
        id: string;
        file: File | null;
      }>;
    }>
  >([]);
  const [formData, setFormData] = useState({
    // Table fields only
    nomi: "",
    vazirlik: "",
    texnologiya: "",
    status: "Test",
    tashkilotShakli: "",
    asosiyMaqsad: "",
    normativHuquqiyHujjat: "",
    texnologikYoriknomaMavjudligi: false,
    maqlumotAlmashishSharti: "",
    sorovlarOrtachaOylik: 0,
    qaysiTashkilotTomondan: "",
    mspdManzil: "",
    axborotTizimiNomi: "",
  });

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null): void => {
    setFormData((prev) => ({ ...prev, [field]: file }));
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
    setDynamicTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              files: tab.files.filter((f) => f.id !== fileId),
            }
          : tab
      )
    );
  };

  const handleAddNewTab = () => {
    if (newTabName.trim()) {
      const newTab = {
        id: `tab_${Date.now()}`,
        name: newTabName.trim(),
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
      setIsModalOpen(false);
      setActiveTab(newTab.id);
    }
  };

  const handleRemoveTab = (tabId: string) => {
    setDynamicTabs((prev) => prev.filter((tab) => tab.id !== tabId));
    if (activeTab === tabId) {
      setActiveTab("passport");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, field: string) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check file type
      const allowedTypes = [".pdf", ".doc", ".docx", ".txt"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      if (allowedTypes.includes(fileExtension)) {
        handleFileUpload(field, file);
      } else {
        alert("Faqat PDF, DOC, DOCX, TXT formatlarida fayl yuklash mumkin");
      }
    }
  };

  const handleSave = async () => {
    // Ma'lumotlarni tekshirish
    if (
      !formData.nomi ||
      !formData.vazirlik ||
      !formData.texnologiya ||
      !formData.tashkilotShakli
    ) {
      alert("Barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    try {
      // Dynamic tablarni tayyorlash
      // Fayllarni base64 formatda saqlash
      const processFiles = async (files: any[]) => {
        const processedFiles = [];
        for (const file of files) {
          if (file.file) {
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
          }
        }
        return processedFiles;
      };

      const preparedDynamicTabs = await Promise.all(
        dynamicTabs.map(async (tab: any) => ({
          name: tab.name,
          title: tab.title,
          description: tab.description,
          files: await processFiles(tab.files),
        }))
      );

      // LocalStorage'ga saqlash
      const newIntegration = localStorageUtils.addIntegration({
        nomi: formData.nomi,
        vazirlik: formData.vazirlik,
        texnologiya: formData.texnologiya as
          | "REST"
          | "SOAP"
          | "MQ"
          | "File exchange",
        status: formData.status as "Active" | "Test" | "Archived",
        tashkilotShakli: formData.tashkilotShakli,
        asosiyMaqsad: formData.asosiyMaqsad,
        normativHuquqiyHujjat: formData.normativHuquqiyHujjat,
        texnologikYoriknomaMavjudligi: formData.texnologikYoriknomaMavjudligi,
        maqlumotAlmashishSharti: formData.maqlumotAlmashishSharti,
        sorovlarOrtachaOylik: formData.sorovlarOrtachaOylik,
        qaysiTashkilotTomondan: formData.qaysiTashkilotTomondan,
        mspdManzil: formData.mspdManzil,
        axborotTizimiNomi: formData.axborotTizimiNomi,
        // Qo'shimcha maydonlar
        huquqiyAsos: formData.normativHuquqiyHujjat,
        sana: new Date().toISOString().split("T")[0],
        muddat: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 1 yil
        tavsif: formData.asosiyMaqsad,
        tashkilotTuri:
          formData.tashkilotShakli === "Davlat tashkiloti"
            ? "Davlat tashkiloti"
            : "Bank",
        // Dynamic tabs
        dynamicTabs: preparedDynamicTabs,
      });

      alert("Integratsiya muvaffaqiyatli saqlandi!");

      // Integrations listiga qaytish
      router.push("/integrations");
    } catch (error) {
      console.error("Saqlashda xatolik:", error);
      alert("Saqlashda xatolik yuz berdi!");
    }
  };

  const handleCancel = () => {
    router.push("/integrations");
  };

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

        {/* Select fields row - maximum width */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="texnologiya">Texnologiya *</Label>
            <Select
              value={formData.texnologiya}
              onValueChange={(value) => handleInputChange("texnologiya", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Texnologiyani tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REST">REST API</SelectItem>
                <SelectItem value="SOAP">SOAP</SelectItem>
                <SelectItem value="GraphQL">GraphQL</SelectItem>
                <SelectItem value="MQ">Message Queue</SelectItem>
                <SelectItem value="File exchange">File exchange</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Holat *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Holatni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Test">Test</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tashkilotShakli">Tashkilot shakli *</Label>
            <Select
              value={formData.tashkilotShakli}
              onValueChange={(value) =>
                handleInputChange("tashkilotShakli", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tashkilot shaklini tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Davlat tashkiloti">
                  Davlat tashkiloti
                </SelectItem>
                <SelectItem value="Xususiy tashkilot">
                  Xususiy tashkilot
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="texnologikYoriknomaMavjudligi">
              Texnologik yo'riqnoma mavjudligi *
            </Label>
            <Select
              value={formData.texnologikYoriknomaMavjudligi ? "true" : "false"}
              onValueChange={(value) =>
                handleInputChange(
                  "texnologikYoriknomaMavjudligi",
                  value === "true"
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Yo'riqnoma holatini tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Mavjud</SelectItem>
                <SelectItem value="false">Mavjud emas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main input fields row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomi">Integratsiya nomi *</Label>
              <Input
                id="nomi"
                value={formData.nomi}
                onChange={(e) => handleInputChange("nomi", e.target.value)}
                placeholder="Integratsiya nomini kiriting"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vazirlik">Bank nomi *</Label>
              <Input
                id="vazirlik"
                value={formData.vazirlik}
                onChange={(e) => handleInputChange("vazirlik", e.target.value)}
                placeholder="Bank nomini kiriting"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sorovlarOrtachaOylik">
                Oylik sorovlar soni *
              </Label>
              <Input
                id="sorovlarOrtachaOylik"
                type="number"
                value={formData.sorovlarOrtachaOylik}
                onChange={(e) =>
                  handleInputChange(
                    "sorovlarOrtachaOylik",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Oylik sorovlar sonini kiriting"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qaysiTashkilotTomondan">
                Ma'lumot beruvchi tashkilot *
              </Label>
              <Input
                id="qaysiTashkilotTomondan"
                value={formData.qaysiTashkilotTomondan}
                onChange={(e) =>
                  handleInputChange("qaysiTashkilotTomondan", e.target.value)
                }
                placeholder="Ma'lumot beruvchi tashkilotni kiriting"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="axborotTizimiNomi">Axborot tizimi nomi *</Label>
              <Input
                id="axborotTizimiNomi"
                value={formData.axborotTizimiNomi}
                onChange={(e) =>
                  handleInputChange("axborotTizimiNomi", e.target.value)
                }
                placeholder="Axborot tizimi nomini kiriting"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mspdManzil">MSPD manzili *</Label>
              <Input
                id="mspdManzil"
                value={formData.mspdManzil}
                onChange={(e) =>
                  handleInputChange("mspdManzil", e.target.value)
                }
                placeholder="MSPD manzilini kiriting"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="normativHuquqiyHujjat">
                Normativ-huquqiy hujjat *
              </Label>
              <Input
                id="normativHuquqiyHujjat"
                value={formData.normativHuquqiyHujjat}
                onChange={(e) =>
                  handleInputChange("normativHuquqiyHujjat", e.target.value)
                }
                placeholder="Normativ-huquqiy hujjat nomini kiriting"
              />
            </div>
          </div>
        </div>

        {/* Textarea fields row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asosiyMaqsad">Asosiy vazifasi *</Label>
              <Textarea
                id="asosiyMaqsad"
                value={formData.asosiyMaqsad}
                onChange={(e) =>
                  handleInputChange("asosiyMaqsad", e.target.value)
                }
                placeholder="Integratsiyaning asosiy vazifasini kiriting"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maqlumotAlmashishSharti">
                Ma'lumot almashish sharti *
              </Label>
              <Textarea
                id="maqlumotAlmashishSharti"
                value={formData.maqlumotAlmashishSharti}
                onChange={(e) =>
                  handleInputChange("maqlumotAlmashishSharti", e.target.value)
                }
                placeholder="Ma'lumot almashish shartlarini kiriting"
                rows={3}
              />
            </div>
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
          <Input
            id={`${tab.id}_title`}
            value={tab.title}
            onChange={(e) =>
              handleDynamicTabFieldChange(tab.id, "title", e.target.value)
            }
            placeholder="Sarlavha kiriting"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <Label htmlFor={`${tab.id}_description`}>Tavsif *</Label>
          <Input
            id={`${tab.id}_description`}
            value={tab.description}
            onChange={(e) =>
              handleDynamicTabFieldChange(tab.id, "description", e.target.value)
            }
            placeholder="Tavsif kiriting"
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
                {tab.files.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFileInput(tab.id, fileInput.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
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
                      onClick={() =>
                        handleFileChange(tab.id, fileInput.id, null)
                      }
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = e.dataTransfer.files;
                      if (files && files.length > 0) {
                        const file = files[0];
                        const allowedTypes = [".pdf", ".doc", ".docx", ".txt"];
                        const fileExtension =
                          "." + file.name.split(".").pop()?.toLowerCase();
                        if (allowedTypes.includes(fileExtension)) {
                          handleFileChange(tab.id, fileInput.id, file);
                        } else {
                          alert(
                            "Faqat PDF, DOC, DOCX, TXT formatlarida fayl yuklash mumkin"
                          );
                        }
                      }
                    }}
                  >
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
            Yangi integratsiya
          </h1>
          <p className="text-muted-foreground">
            Integratsiya ma'lumotlarini to'ldiring
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
            Barcha kerakli ma'lumotlarni to'ldiring va fayllarni yuklang
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
                      Yangi tab nomini kiriting
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
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Bekor qilish
                    </Button>
                    <Button type="button" onClick={handleAddNewTab}>
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
        <Button variant="outline" onClick={handleCancel}>
          Bekor qilish
        </Button>
        <Button onClick={handleSave}>Saqlash</Button>
      </div>
    </div>
  );
}
