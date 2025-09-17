"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface TableHeaderFiltersProps {
  onFiltersChange: (filters: HeaderFilters) => void;
}

interface HeaderFilters {
  nomi: string;
  vazirlik: string;
  tashkilotShakli: string;
  asosiyMaqsad: string;
  normativHuquqiyHujjat: string;
  texnologikYoriknomaMavjudligi: string;
  texnologiya: string;
  maqlumotAlmashishSharti: string;
  sorovlarOrtachaOylik: {
    min: number;
    max: number;
  };
  qaysiTashkilotTomondan: string;
  mspdManzil: string;
  axborotTizimiNomi: string;
  status: string;
}

const statusOptions = [
  { value: "all", label: "Barcha" },
  { value: "Active", label: "Faol" },
  { value: "Test", label: "Test" },
  { value: "Archived", label: "Arxivlangan" },
];

const texnologiyaOptions = [
  { value: "all", label: "Barcha" },
  { value: "REST", label: "REST" },
  { value: "SOAP", label: "SOAP" },
  { value: "MQ", label: "MQ" },
  { value: "File exchange", label: "Fayl almashinuvi" },
];

const tashkilotShakliOptions = [
  { value: "all", label: "Barcha" },
  { value: "Davlat tashkiloti", label: "Davlat tashkiloti" },
  { value: "Xususiy tashkilot", label: "Xususiy tashkilot" },
];

const texnologikYoriknomaOptions = [
  { value: "all", label: "Barcha" },
  { value: "true", label: "Mavjud" },
  { value: "false", label: "Yo'q" },
];

export default function TableHeaderFilters({
  onFiltersChange,
}: TableHeaderFiltersProps) {
  const [filters, setFilters] = useState<HeaderFilters>({
    nomi: "",
    vazirlik: "",
    tashkilotShakli: "all",
    asosiyMaqsad: "",
    normativHuquqiyHujjat: "",
    texnologikYoriknomaMavjudligi: "all",
    texnologiya: "all",
    maqlumotAlmashishSharti: "",
    sorovlarOrtachaOylik: { min: 0, max: 100000 },
    qaysiTashkilotTomondan: "",
    mspdManzil: "",
    axborotTizimiNomi: "",
    status: "all",
  });

  const handleFilterChange = (key: keyof HeaderFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      nomi: "",
      vazirlik: "",
      tashkilotShakli: "all",
      asosiyMaqsad: "",
      normativHuquqiyHujjat: "",
      texnologikYoriknomaMavjudligi: "all",
      texnologiya: "all",
      maqlumotAlmashishSharti: "",
      sorovlarOrtachaOylik: { min: 0, max: 100000 },
      qaysiTashkilotTomondan: "",
      mspdManzil: "",
      axborotTizimiNomi: "",
      status: "all",
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.nomi) count++;
    if (filters.vazirlik) count++;
    if (filters.tashkilotShakli !== "all") count++;
    if (filters.asosiyMaqsad) count++;
    if (filters.normativHuquqiyHujjat) count++;
    if (filters.texnologikYoriknomaMavjudligi !== "all") count++;
    if (filters.texnologiya !== "all") count++;
    if (filters.maqlumotAlmashishSharti) count++;
    if (
      filters.sorovlarOrtachaOylik.min > 0 ||
      filters.sorovlarOrtachaOylik.max < 100000
    )
      count++;
    if (filters.qaysiTashkilotTomondan) count++;
    if (filters.mspdManzil) count++;
    if (filters.axborotTizimiNomi) count++;
    if (filters.status !== "all") count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filterlar
          </h3>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                {activeFiltersCount} filter
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50 text-xs h-7 px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Tozalash
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {/* Nomi Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              Nomi
            </Label>
            <Input
              placeholder="Qidirish..."
              value={filters.nomi}
              onChange={(e) => handleFilterChange("nomi", e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {/* Vazirlik Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              Vazirlik
            </Label>
            <Input
              placeholder="Qidirish..."
              value={filters.vazirlik}
              onChange={(e) => handleFilterChange("vazirlik", e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {/* Tashkilot Shakli Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              Tashkilot shakli
            </Label>
            <Select
              value={filters.tashkilotShakli}
              onValueChange={(value) =>
                handleFilterChange("tashkilotShakli", value)
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tashkilotShakliOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Asosiy Maqsad Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              Asosiy maqsad
            </Label>
            <Input
              placeholder="Qidirish..."
              value={filters.asosiyMaqsad}
              onChange={(e) =>
                handleFilterChange("asosiyMaqsad", e.target.value)
              }
              className="h-8 text-sm"
            />
          </div>

          {/* Normativ Huquqiy Hujjat Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              Normativ hujjat
            </Label>
            <Input
              placeholder="Qidirish..."
              value={filters.normativHuquqiyHujjat}
              onChange={(e) =>
                handleFilterChange("normativHuquqiyHujjat", e.target.value)
              }
              className="h-8 text-sm"
            />
          </div>

          {/* Texnologik Yo'riqnoma Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              Texnologik yo'riqnoma
            </Label>
            <Select
              value={filters.texnologikYoriknomaMavjudligi}
              onValueChange={(value) =>
                handleFilterChange("texnologikYoriknomaMavjudligi", value)
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {texnologikYoriknomaOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Texnologiya Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              Texnologiya
            </Label>
            <Select
              value={filters.texnologiya}
              onValueChange={(value) =>
                handleFilterChange("texnologiya", value)
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {texnologiyaOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ma'lumot Almashish Sharti Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              Almashish sharti
            </Label>
            <Input
              placeholder="Qidirish..."
              value={filters.maqlumotAlmashishSharti}
              onChange={(e) =>
                handleFilterChange("maqlumotAlmashishSharti", e.target.value)
              }
              className="h-8 text-sm"
            />
          </div>

          {/* Oylik Sorovlar Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              Oylik sorovlar
            </Label>
            <div className="flex gap-1">
              <Input
                type="number"
                placeholder="Min"
                value={filters.sorovlarOrtachaOylik.min || ""}
                onChange={(e) =>
                  handleFilterChange("sorovlarOrtachaOylik", {
                    ...filters.sorovlarOrtachaOylik,
                    min: parseInt(e.target.value) || 0,
                  })
                }
                className="h-8 text-sm"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.sorovlarOrtachaOylik.max || ""}
                onChange={(e) =>
                  handleFilterChange("sorovlarOrtachaOylik", {
                    ...filters.sorovlarOrtachaOylik,
                    max: parseInt(e.target.value) || 100000,
                  })
                }
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* Ma'lumot Beruvchi Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              Ma'lumot beruvchi
            </Label>
            <Input
              placeholder="Qidirish..."
              value={filters.qaysiTashkilotTomondan}
              onChange={(e) =>
                handleFilterChange("qaysiTashkilotTomondan", e.target.value)
              }
              className="h-8 text-sm"
            />
          </div>

          {/* MSPD Manzili Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              MSPD manzili
            </Label>
            <Input
              placeholder="Qidirish..."
              value={filters.mspdManzil}
              onChange={(e) => handleFilterChange("mspdManzil", e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {/* Axborot Tizimi Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              Axborot tizimi
            </Label>
            <Input
              placeholder="Qidirish..."
              value={filters.axborotTizimiNomi}
              onChange={(e) =>
                handleFilterChange("axborotTizimiNomi", e.target.value)
              }
              className="h-8 text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 dark:text-gray-400">
              Status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
