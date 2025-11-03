"use client";

import type { AuditLog } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Database, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditDetailModalProps {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const actionLabels: Record<string, string> = {
  created: "Integratsiya yaratildi",
  updated: "Integratsiya tahrirlandi",
  deleted: "Integratsiya o'chirildi",
};

const actionColors: Record<string, string> = {
  created: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  updated: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  deleted: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "Integratsiya yaratildi":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Integratsiya tahrirlandi":
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Integratsiya arxivlandi":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "Integratsiya o'chirildi":
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "Integratsiya ko'rildi":
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  "Tizim sozlamalari o'zgartirildi":
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

// Field nomlarini to'g'ri formatlash
const fieldLabels: Record<string, string> = {
  axborotTizimiNomi:
    "Axborot tizimi yoki resursning to'liq nomi (yoki interfeys)",
  integratsiyaUsuli: "Integratsiyani amalga oshirish usuli",
  malumotNomi: "Uzatiladigan/qabul qilinadigan ma'lumot nomi",
  tashkilotNomiVaShakli: "Integratsiya qilingan tashkilot nomi va shakli",
  asosiyMaqsad: "Integratsiyadan asosiy maqsad",
  normativHuquqiyHujjat: "Normativ-huquqiy hujjat",
  texnologikYoriknomaMavjudligi: "Texnologik yo'riqnoma mavjudligi",
  malumotFormati: "Ma'lumot formati",
  maqlumotAlmashishSharti: "Ma'lumot almashish sharti",
  yangilanishDavriyligi: "Ma'lumot yangilanish davriyligi",
  malumotHajmi: "Ma'lumot hajmi",
  aloqaKanali: "Hamkor tashkilot bilan aloqa kanali",
  oxirgiUzatishVaqti: "So'nggi muvaffaqiyatli uzatish vaqti",
  markaziyBankAloqa: "Markaziy bank tomonidan texnik aloqa shaxsi",
  hamkorAloqa: "Hamkor tashkilot tomonidan texnik aloqa shaxsi",
  status: "Integratsiya holati / statusi",
  izoh: "Izoh / qo'shimcha ma'lumot",
};

// Oylar nomlari
const monthNames: Record<number, string> = {
  0: "Yanvar",
  1: "Fevral",
  2: "Mart",
  3: "Aprel",
  4: "May",
  5: "Iyun",
  6: "Iyul",
  7: "Avgust",
  8: "Sentabr",
  9: "Oktabr",
  10: "Noyabr",
  11: "Dekabr",
};

// Sana formatlash
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
}

export function AuditDetailModal({
  log,
  open,
  onOpenChange,
}: AuditDetailModalProps) {
  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl">
                Audit yozuvi tafsilotlari
              </DialogTitle>
              <DialogDescription className="mt-2">
                Tizimda amalga oshirilgan o'zgarish haqida to'liq ma'lumot
              </DialogDescription>
            </div>
            <Badge
              className={cn(
                "flex-shrink-0",
                actionColors[log.action] || actionColors.default
              )}
            >
              {actionLabels[log.action] || log.action}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Asosiy ma'lumotlar</h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Foydalanuvchi</p>
                  <p className="text-muted-foreground">{log.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    ID: {log.userId}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Sana va vaqt</p>
                  <p className="text-muted-foreground">
                    {formatDate(log.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Information */}
          {log.integrationId && log.integrationName && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Integratsiya ma'lumotlari
                </h3>

                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">Integratsiya nomi</p>
                    <p className="text-muted-foreground">
                      {log.integrationName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {log.integrationId}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Changes Information */}
          {log.changes && Object.keys(log.changes).length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">O'zgarishlar</h3>

                <div className="space-y-3">
                  {Object.entries(log.changes).map(([field, value]) => {
                    const fieldLabel = fieldLabels[field] || field;
                    // value struktura { old?: any; new: any } bo'lishi mumkin
                    const isChangeObject =
                      value &&
                      typeof value === "object" &&
                      ("old" in value || "new" in value);

                    return (
                      <div key={field} className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <p className="font-medium">{fieldLabel}</p>
                          {isChangeObject ? (
                            <div className="space-y-1 text-sm">
                              {value.old !== undefined && (
                                <div>
                                  <span className="text-red-600 dark:text-red-400 font-medium">
                                    Eski:{" "}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {String(value.old || "(bo'sh)")}
                                  </span>
                                </div>
                              )}
                              {value.new !== undefined && (
                                <div>
                                  <span className="text-green-600 dark:text-green-400 font-medium">
                                    Yangi:{" "}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {String(value.new || "(bo'sh)")}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-muted-foreground font-mono text-sm">
                              {String(value)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Metadata */}
          <Separator />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Audit ID: {log.id}</p>
            <p>Timestamp: {log.timestamp}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
