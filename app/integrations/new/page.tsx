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
import { ArrowLeft, Upload, X } from "lucide-react";

export default function NewIntegrationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("passport");
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
    // Konsepsiya
    konsepsiyaMatn: "",
    konsepsiyaFayl: null as File | null,
    // Texnik topshiriq
    texnikTopshiriqMatn: "",
    texnikTopshiriqFayl: null as File | null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
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

  const renderKonsepsiyaContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="konsepsiyaMatn">Konsepsiya matni *</Label>
        <Textarea
          id="konsepsiyaMatn"
          value={formData.konsepsiyaMatn}
          onChange={(e) => handleInputChange("konsepsiyaMatn", e.target.value)}
          placeholder="Integratsiya konsepsiyasi haqida batafsil ma'lumot..."
          rows={10}
        />
      </div>

      <div className="space-y-2">
        <Label>Konsepsiya fayli</Label>
        <div className="mt-2">
          {formData.konsepsiyaFayl ? (
            <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Upload className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {formData.konsepsiyaFayl.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(formData.konsepsiyaFayl.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleFileUpload("konsepsiyaFayl", null)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "konsepsiyaFayl")}
            >
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="konsepsiya-file" className="cursor-pointer">
                  <span className="text-sm font-medium text-gray-900 hover:text-gray-700">
                    Fayl yuklash uchun bosing
                  </span>
                </Label>
                <input
                  id="konsepsiya-file"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleFileUpload("konsepsiyaFayl", file);
                  }}
                />
                <p className="text-xs text-gray-500">
                  yoki faylni bu yerga sudrab tashlang
                </p>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-400">
                  PDF, DOC, DOCX, TXT formatlarida • Maksimal 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTexnikTopshiriqContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="texnikTopshiriqMatn">Texnik topshiriq matni *</Label>
        <Textarea
          id="texnikTopshiriqMatn"
          value={formData.texnikTopshiriqMatn}
          onChange={(e) =>
            handleInputChange("texnikTopshiriqMatn", e.target.value)
          }
          placeholder="Texnik topshiriq haqida batafsil ma'lumot..."
          rows={10}
        />
      </div>

      <div className="space-y-2">
        <Label>Texnik topshiriq fayli</Label>
        <div className="mt-2">
          {formData.texnikTopshiriqFayl ? (
            <div className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {formData.texnikTopshiriqFayl.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(formData.texnikTopshiriqFayl.size / 1024 / 1024).toFixed(
                      2
                    )}{" "}
                    MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleFileUpload("texnikTopshiriqFayl", null)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "texnikTopshiriqFayl")}
            >
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="texnik-file" className="cursor-pointer">
                  <span className="text-sm font-medium text-gray-900 hover:text-gray-700">
                    Fayl yuklash uchun bosing
                  </span>
                </Label>
                <input
                  id="texnik-file"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleFileUpload("texnikTopshiriqFayl", file);
                  }}
                />
                <p className="text-xs text-gray-500">
                  yoki faylni bu yerga sudrab tashlang
                </p>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-400">
                  PDF, DOC, DOCX, TXT formatlarida • Maksimal 10MB
                </p>
              </div>
            </div>
          )}
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="passport">Pasport</TabsTrigger>
              <TabsTrigger value="konsepsiya">Konsepsiya</TabsTrigger>
              <TabsTrigger value="texnik">Texnik topshiriq</TabsTrigger>
            </TabsList>

            <TabsContent value="passport" className="space-y-4">
              {renderPassportContent()}
            </TabsContent>

            <TabsContent value="konsepsiya" className="space-y-4">
              {renderKonsepsiyaContent()}
            </TabsContent>

            <TabsContent value="texnik" className="space-y-4">
              {renderTexnikTopshiriqContent()}
            </TabsContent>
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
