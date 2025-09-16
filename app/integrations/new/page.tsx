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
    // Passport - I. Umumiy ma'lumotlar
    nomi: "",
    vazirlik: "",
    huquqiyAsos: "",
    texnologiya: "",
    yonalish: "",
    status: "Test",
    sana: "",
    muddat: "",
    tavsif: "",
    // Passport - II. Asosiy texnik xususiyatlar
    texnikXususiyatlar: "",
    apiEndpoint: "",
    authenticationType: "",
    dataFormat: "",
    responseTime: "",
    throughput: "",
    securityLevel: "",
    // Passport - III. Yaratish, foydalanish va foydalanishdan chiqarish
    yaratishBosqichlari: "",
    foydalanishQoidalari: "",
    texnikQollabQuvvatlash: "",
    monitoring: "",
    backupStrategy: "",
    disasterRecovery: "",
  });

  const handleInputChange = (field: string, value: string) => {
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

  const handleSave = () => {
    // Here you would save the integration data
    console.log("Saving integration:", formData);
    // Navigate back to integrations list
    router.push("/integrations");
  };

  const handleCancel = () => {
    router.push("/integrations");
  };

  const renderPassportContent = () => (
    <div className="space-y-8">
      {/* I. Umumiy ma'lumotlar */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
            I
          </div>
          <h3 className="text-lg font-semibold">Umumiy ma'lumotlar</h3>
        </div>

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
              <Label htmlFor="huquqiyAsos">Huquqiy asos *</Label>
              <Input
                id="huquqiyAsos"
                value={formData.huquqiyAsos}
                onChange={(e) =>
                  handleInputChange("huquqiyAsos", e.target.value)
                }
                placeholder="O'zR PV 2024-yil XX-son qarori"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="texnologiya">Texnologiya *</Label>
              <Select
                value={formData.texnologiya}
                onValueChange={(value) =>
                  handleInputChange("texnologiya", value)
                }
              >
                <SelectTrigger>
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
              <Label htmlFor="yonalish">Yo'nalish *</Label>
              <Select
                value={formData.yonalish}
                onValueChange={(value) => handleInputChange("yonalish", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Yo'nalishni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="One-way">One-way</SelectItem>
                  <SelectItem value="Two-way">Two-way</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Holat *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Holatni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Test">Test</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sana">Boshlanish sanasi *</Label>
              <Input
                id="sana"
                type="date"
                value={formData.sana}
                onChange={(e) => handleInputChange("sana", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="muddat">Tugash sanasi *</Label>
              <Input
                id="muddat"
                type="date"
                value={formData.muddat}
                onChange={(e) => handleInputChange("muddat", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tavsif">Tavsif *</Label>
              <Textarea
                id="tavsif"
                value={formData.tavsif}
                onChange={(e) => handleInputChange("tavsif", e.target.value)}
                placeholder="Integratsiya haqida batafsil ma'lumot"
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* II. Asosiy texnik xususiyatlar */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
            II
          </div>
          <h3 className="text-lg font-semibold">
            Asosiy texnik xususiyatlar haqida ma'lumotlar
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="texnikXususiyatlar">Texnik xususiyatlar *</Label>
              <Textarea
                id="texnikXususiyatlar"
                value={formData.texnikXususiyatlar}
                onChange={(e) =>
                  handleInputChange("texnikXususiyatlar", e.target.value)
                }
                placeholder="Texnik xususiyatlar haqida ma'lumot"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiEndpoint">API Endpoint *</Label>
              <Input
                id="apiEndpoint"
                value={formData.apiEndpoint}
                onChange={(e) =>
                  handleInputChange("apiEndpoint", e.target.value)
                }
                placeholder="https://api.example.com/v1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authenticationType">
                Autentifikatsiya turi *
              </Label>
              <Select
                value={formData.authenticationType}
                onValueChange={(value) =>
                  handleInputChange("authenticationType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Autentifikatsiya turini tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="API Key">API Key</SelectItem>
                  <SelectItem value="OAuth 2.0">OAuth 2.0</SelectItem>
                  <SelectItem value="JWT">JWT</SelectItem>
                  <SelectItem value="Basic Auth">Basic Auth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFormat">Ma'lumot formati *</Label>
              <Select
                value={formData.dataFormat}
                onValueChange={(value) =>
                  handleInputChange("dataFormat", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ma'lumot formatini tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JSON">JSON</SelectItem>
                  <SelectItem value="XML">XML</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="responseTime">Javob vaqti (ms) *</Label>
              <Input
                id="responseTime"
                type="number"
                value={formData.responseTime}
                onChange={(e) =>
                  handleInputChange("responseTime", e.target.value)
                }
                placeholder="500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="throughput">Throughput (req/min) *</Label>
              <Input
                id="throughput"
                type="number"
                value={formData.throughput}
                onChange={(e) =>
                  handleInputChange("throughput", e.target.value)
                }
                placeholder="1000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityLevel">Xavfsizlik darajasi *</Label>
              <Select
                value={formData.securityLevel}
                onValueChange={(value) =>
                  handleInputChange("securityLevel", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Xavfsizlik darajasini tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* III. Yaratish, foydalanish va foydalanishdan chiqarish */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
            III
          </div>
          <h3 className="text-lg font-semibold">
            Yaratish, foydalanish va foydalanishdan chiqarish haqidagi
            ma'lumotlar
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="yaratishBosqichlari">Yaratish bosqichlari *</Label>
            <Textarea
              id="yaratishBosqichlari"
              value={formData.yaratishBosqichlari}
              onChange={(e) =>
                handleInputChange("yaratishBosqichlari", e.target.value)
              }
              placeholder="Integratsiya yaratish bosqichlari haqida ma'lumot"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foydalanishQoidalari">
              Foydalanish qoidalari *
            </Label>
            <Textarea
              id="foydalanishQoidalari"
              value={formData.foydalanishQoidalari}
              onChange={(e) =>
                handleInputChange("foydalanishQoidalari", e.target.value)
              }
              placeholder="Foydalanish qoidalari va talablari"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="texnikQollabQuvvatlash">
              Texnik qo'llab-quvvatlash *
            </Label>
            <Textarea
              id="texnikQollabQuvvatlash"
              value={formData.texnikQollabQuvvatlash}
              onChange={(e) =>
                handleInputChange("texnikQollabQuvvatlash", e.target.value)
              }
              placeholder="Texnik qo'llab-quvvatlash haqida ma'lumot"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monitoring">Monitoring *</Label>
            <Textarea
              id="monitoring"
              value={formData.monitoring}
              onChange={(e) => handleInputChange("monitoring", e.target.value)}
              placeholder="Monitoring va kuzatish tizimi"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backupStrategy">Backup strategiyasi *</Label>
            <Textarea
              id="backupStrategy"
              value={formData.backupStrategy}
              onChange={(e) =>
                handleInputChange("backupStrategy", e.target.value)
              }
              placeholder="Backup va zaxira nusxa strategiyasi"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="disasterRecovery">Disaster Recovery *</Label>
            <Textarea
              id="disasterRecovery"
              value={formData.disasterRecovery}
              onChange={(e) =>
                handleInputChange("disasterRecovery", e.target.value)
              }
              placeholder="Falokatdan tiklash strategiyasi"
              rows={3}
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
