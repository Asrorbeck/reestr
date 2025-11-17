"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Calendar, Building, Activity, FileText, Hash } from "lucide-react";
import { Integration } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DetailModalProps {
  integration: Integration | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Test: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export default function DetailModal({
  integration,
  isOpen,
  onClose,
}: DetailModalProps) {
  if (!integration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {integration.nomi}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="flex items-center gap-4">
            <Badge
              className={cn(
                "text-sm font-medium px-3 py-1",
                statusColors[integration.status]
              )}
            >
              {integration.status}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>
                Yaratilgan:{" "}
                {new Date(integration.createdAt).toLocaleDateString("uz-UZ")}
              </span>
            </div>
          </div>

          {/* Asosiy Maqsad */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Asosiy Maqsad
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {integration.asosiyMaqsad}
              </p>
            </div>
          </div>

          {/* Grid Layout for Other Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vazirlik */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Vazirlik/Tashkilot
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                {integration.vazirlik}
              </p>
            </div>

            {/* Tashkilot Shakli */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Tashkilot Shakli
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                {integration.tashkilotShakli}
              </p>
            </div>

            {/* Texnologiya */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Texnologiya
              </h4>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                {integration.texnologiya}
              </Badge>
            </div>

            {/* Oylik Sorovlar */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Oylik Sorovlar
              </h4>
              <p className="text-gray-700 dark:text-gray-300 font-mono">
                {integration.sorovlarOrtachaOylik.toLocaleString()} ta
              </p>
            </div>

            {/* Huquqiy Asos */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Huquqiy Asos
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {integration.huquqiyAsos}
              </p>
            </div>

            {/* Normativ Huquqiy Hujjat */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Normativ Huquqiy Hujjat
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {integration.normativHuquqiyHujjat}
              </p>
            </div>

            {/* Texnologik Yo'riqnoma */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Texnologik Yo'riqnoma
              </h4>
              <Badge
                className={cn(
                  "text-sm font-medium px-2 py-1",
                  integration.texnologikYoriknomaMavjudligi
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                )}
              >
                {integration.texnologikYoriknomaMavjudligi ? "Mavjud" : "Yo'q"}
              </Badge>
            </div>

            {/* Ma'lumot Almashish Sharti */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Ma'lumot Almashish Sharti
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                {integration.maqlumotAlmashishSharti}
              </p>
            </div>

            {/* Ma'lumot Beruvchi */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Ma'lumot Beruvchi
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                {integration.qaysiTashkilotTomondan}
              </p>
            </div>

            {/* MSPD Manzili */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                MSPD Manzili
              </h4>
              <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                {integration.mspdManzil}
              </p>
            </div>

            {/* Axborot Tizimi */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Axborot Tizimi
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                {integration.axborotTizimiNomi}
              </p>
            </div>

            {/* Sana va Muddat */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Sana
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                {new Date(integration.sana).toLocaleDateString("uz-UZ")}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Muddat
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                {new Date(integration.muddat).toLocaleDateString("uz-UZ")}
              </p>
            </div>
          </div>

          {/* Tavsif */}
          {integration.tavsif && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Tavsif
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {integration.tavsif}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={onClose} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Yopish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
