"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type { Integration } from "@/lib/types";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IntegrationFormProps {
  integration?: Integration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (integration: Partial<Integration>) => void;
}

export function IntegrationForm({
  integration,
  open,
  onOpenChange,
  onSave,
}: IntegrationFormProps) {
  const [formData, setFormData] = useState({
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

  useEffect(() => {
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
    } else {
      // Reset form when opening for new integration
      setFormData({
        axborotTizimiNomi: "",
        integratsiyaUsuli: "",
        malumotNomi: "",
        tashkilotNomiVaShakli: "",
        asosiyMaqsad: "",
        normativHuquqiyHujjat: "",
        texnologikYoriknomaMavjudligi: "",
        malumotFormati: "JSON",
        maqlumotAlmashishSharti: "",
        yangilanishDavriyligi: "",
        malumotHajmi: "",
        aloqaKanali: "",
        oxirgiUzatishVaqti: "",
        markaziyBankAloqa: "",
        hamkorAloqa: "",
        status: "faol",
        izoh: "",
      });
    }
  }, [integration, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {integration
              ? "Integratsiyani tahrirlash"
              : "Yangi integratsiya qo'shish"}
          </DialogTitle>
          <DialogDescription>
            Integratsiya ma'lumotlarini to'ldiring
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="axborotTizimiNomi">
                Axborot tizimi yoki resursning to'liq nomi (yoki interfeys) *
              </Label>
              <Input
                id="axborotTizimiNomi"
                value={formData.axborotTizimiNomi}
                onChange={(e) => handleChange("axborotTizimiNomi", e.target.value)}
                placeholder="Axborot tizimi nomini kiriting"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="integratsiyaUsuli">
                Integratsiyani amalga oshirish usuli *
              </Label>
              <Input
                id="integratsiyaUsuli"
                value={formData.integratsiyaUsuli}
                onChange={(e) => handleChange("integratsiyaUsuli", e.target.value)}
                placeholder="Idoralararo integrallashuv platformasi orqali yoki to'g'ridan to'g'ri"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="malumotNomi">
              Uzatiladigan/qabul qilinadigan ma'lumot nomi *
            </Label>
            <Input
              id="malumotNomi"
              value={formData.malumotNomi}
              onChange={(e) => handleChange("malumotNomi", e.target.value)}
              placeholder="Ma'lumot nomini kiriting"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tashkilotNomiVaShakli">
              Integratsiya qilingan tashkilot nomi va shakli *
            </Label>
            <Input
              id="tashkilotNomiVaShakli"
              value={formData.tashkilotNomiVaShakli}
              onChange={(e) => handleChange("tashkilotNomiVaShakli", e.target.value)}
              placeholder="Tashkilot nomi va shakli (davlat / xususiy)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asosiyMaqsad">
              Integratsiyadan asosiy maqsad *
            </Label>
            <Textarea
              id="asosiyMaqsad"
              value={formData.asosiyMaqsad}
              onChange={(e) => handleChange("asosiyMaqsad", e.target.value)}
              placeholder="Integratsiyadan asosiy maqsadni kiriting"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="normativHuquqiyHujjat">
              Normativ-huquqiy hujjat *
            </Label>
            <Input
              id="normativHuquqiyHujjat"
              value={formData.normativHuquqiyHujjat}
              onChange={(e) => handleChange("normativHuquqiyHujjat", e.target.value)}
              placeholder="Normativ-huquqiy hujjatni kiriting"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="texnologikYoriknomaMavjudligi">
              Axborot almashinuvi bo'yicha texnologik yo'riqnoma mavjudligi
            </Label>
            <Input
              id="texnologikYoriknomaMavjudligi"
              value={formData.texnologikYoriknomaMavjudligi}
              onChange={(e) =>
                handleChange("texnologikYoriknomaMavjudligi", e.target.value)
              }
              placeholder="Texnologik yo'riqnoma mavjudligi"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="malumotFormati">Ma'lumot formati *</Label>
              <Select
                value={formData.malumotFormati}
                onValueChange={(value) =>
                  handleChange(
                    "malumotFormati",
                    value as "JSON" | "XML" | "CSV" | "SOAP" | "REST API"
                  )
                }
              >
                <SelectTrigger id="malumotFormati">
                  <SelectValue />
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
                  handleChange(
                    "status",
                    value as "faol" | "testda" | "rejalashtirilgan" | "muammoli"
                  )
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="faol">Faol</SelectItem>
                  <SelectItem value="testda">Testda</SelectItem>
                  <SelectItem value="rejalashtirilgan">Rejalashtirilgan</SelectItem>
                  <SelectItem value="muammoli">Muammoli</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maqlumotAlmashishSharti">
              Ma'lumot almashish sharti
            </Label>
            <Input
              id="maqlumotAlmashishSharti"
              value={formData.maqlumotAlmashishSharti}
              onChange={(e) => handleChange("maqlumotAlmashishSharti", e.target.value)}
              placeholder="So'rov-javob, push, fayl almashinuvi"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yangilanishDavriyligi">
              Ma'lumot yangilanish davriyligi
            </Label>
            <Input
              id="yangilanishDavriyligi"
              value={formData.yangilanishDavriyligi}
              onChange={(e) => handleChange("yangilanishDavriyligi", e.target.value)}
              placeholder="Real vaqt, kunlik, haftalik, oylik va hokazo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="malumotHajmi">Ma'lumot hajmi</Label>
            <Input
              id="malumotHajmi"
              value={formData.malumotHajmi}
              onChange={(e) => handleChange("malumotHajmi", e.target.value)}
              placeholder="Kunlik / oylik MB yoki GB"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aloqaKanali">
              Hamkor tashkilot bilan aloqa kanali
            </Label>
            <Input
              id="aloqaKanali"
              value={formData.aloqaKanali}
              onChange={(e) => handleChange("aloqaKanali", e.target.value)}
              placeholder="API, VPN, server va hokazo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="oxirgiUzatishVaqti">
              So'nggi muvaffaqiyatli uzatish vaqti
            </Label>
            <Input
              id="oxirgiUzatishVaqti"
              value={formData.oxirgiUzatishVaqti}
              onChange={(e) => handleChange("oxirgiUzatishVaqti", e.target.value)}
              placeholder="Tizimdan online olib beriladi"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="markaziyBankAloqa">
              Markaziy bank tomonidan texnik aloqa shaxsi
            </Label>
            <Input
              id="markaziyBankAloqa"
              value={formData.markaziyBankAloqa}
              onChange={(e) => handleChange("markaziyBankAloqa", e.target.value)}
              placeholder="F.I.Sh, telefon, e-mail"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hamkorAloqa">
              Hamkor tashkilot tomonidan texnik aloqa shaxsi
            </Label>
            <Input
              id="hamkorAloqa"
              value={formData.hamkorAloqa}
              onChange={(e) => handleChange("hamkorAloqa", e.target.value)}
              placeholder="F.I.Sh, telefon, e-mail"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="izoh">Izoh / qo'shimcha ma'lumot</Label>
            <Textarea
              id="izoh"
              value={formData.izoh}
              onChange={(e) => handleChange("izoh", e.target.value)}
              placeholder="Qo'shimcha ma'lumot"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit">
              {integration ? "Saqlash" : "Qo'shish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
