"use client";

import type React from "react";

import { useState } from "react";
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
    nomi: integration?.nomi || "",
    vazirlik: integration?.vazirlik || "",
    huquqiyAsos: integration?.huquqiyAsos || "",
    texnologiya: integration?.texnologiya || "REST",
    yonalish: integration?.yonalish || "One-way",
    status: integration?.status || "Test",
    sana: integration?.sana || new Date().toISOString().split("T")[0],
    muddat: integration?.muddat || "",
    tavsif: integration?.tavsif || "",
  });

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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
              <Label htmlFor="nomi">Integratsiya nomi *</Label>
              <Input
                id="nomi"
                value={formData.nomi}
                onChange={(e) => handleChange("nomi", e.target.value)}
                placeholder="Integratsiya nomini kiriting"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vazirlik">Vazirlik/Tashkilot *</Label>
              <Input
                id="vazirlik"
                value={formData.vazirlik}
                onChange={(e) => handleChange("vazirlik", e.target.value)}
                placeholder="Vazirlik nomini kiriting"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="huquqiyAsos">Huquqiy asos *</Label>
            <Input
              id="huquqiyAsos"
              value={formData.huquqiyAsos}
              onChange={(e) => handleChange("huquqiyAsos", e.target.value)}
              placeholder="Huquqiy asosni kiriting"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Texnologiya *</Label>
              <Select
                value={formData.texnologiya}
                onValueChange={(value) => handleChange("texnologiya", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REST">REST</SelectItem>
                  <SelectItem value="SOAP">SOAP</SelectItem>
                  <SelectItem value="MQ">MQ</SelectItem>
                  <SelectItem value="File exchange">File exchange</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Yo'nalish *</Label>
              <Select
                value={formData.yonalish}
                onValueChange={(value) => handleChange("yonalish", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="One-way">Bir tomonlama</SelectItem>
                  <SelectItem value="Two-way">Ikki tomonlama</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Test">Test</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sana">Boshlangan sana *</Label>
              <Input
                id="sana"
                type="date"
                value={formData.sana}
                onChange={(e) => handleChange("sana", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="muddat">Tugash sanasi *</Label>
              <Input
                id="muddat"
                type="date"
                value={formData.muddat}
                onChange={(e) => handleChange("muddat", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tavsif">Tavsif</Label>
            <Textarea
              id="tavsif"
              value={formData.tavsif}
              onChange={(e) => handleChange("tavsif", e.target.value)}
              placeholder="Integratsiya haqida qo'shimcha ma'lumot"
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
