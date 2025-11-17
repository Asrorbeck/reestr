"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Search, Calendar, Building, Activity } from "lucide-react";
import { Integration } from "@/lib/types";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
}

interface FilterState {
  status: string[];
  texnologiya: string[];
  tashkilotTuri: string[];
  dateRange: {
    start: string;
    end: string;
  };
  sorovlarRange: {
    min: number;
    max: number;
  };
}

const statusOptions = [
  { value: "Active", label: "Faol" },
  { value: "Test", label: "Test" },
  { value: "Archived", label: "Arxivlangan" },
];

const texnologiyaOptions = [
  { value: "REST", label: "REST" },
  { value: "SOAP", label: "SOAP" },
  { value: "MQ", label: "MQ" },
  { value: "File exchange", label: "Fayl almashinuvi" },
];

const tashkilotTuriOptions = [
  { value: "Davlat tashkiloti", label: "Davlat tashkiloti" },
  { value: "Bank", label: "Bank" },
  { value: "Xususiy tashkilot", label: "Xususiy tashkilot" },
];

export default function AdvancedFilters({
  onFiltersChange,
  onSearch,
  searchTerm,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    texnologiya: [],
    tashkilotTuri: [],
    dateRange: { start: "", end: "" },
    sorovlarRange: { min: 0, max: 100000 },
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayFilterChange = (
    key: "status" | "texnologiya" | "tashkilotTuri",
    value: string
  ) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];

    handleFilterChange(key, newArray);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      status: [],
      texnologiya: [],
      tashkilotTuri: [],
      dateRange: { start: "", end: "" },
      sorovlarRange: { min: 0, max: 100000 },
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status.length > 0) count++;
    if (filters.texnologiya.length > 0) count++;
    if (filters.tashkilotTuri.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.sorovlarRange.min > 0 || filters.sorovlarRange.max < 100000)
      count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filter va qidiruv
          </CardTitle>
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
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {isExpanded ? "Yashirish" : "Ko'rsatish"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Integratsiya nomi, tashkilot yoki boshqa ma'lumot bo'yicha qidiring..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>

        {isExpanded && (
          <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Status Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </Label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      filters.status.includes(option.value)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      handleArrayFilterChange("status", option.value)
                    }
                    className={`text-xs ${
                      filters.status.includes(option.value)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Technology Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Texnologiya
              </Label>
              <div className="flex flex-wrap gap-2">
                {texnologiyaOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      filters.texnologiya.includes(option.value)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      handleArrayFilterChange("texnologiya", option.value)
                    }
                    className={`text-xs ${
                      filters.texnologiya.includes(option.value)
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Organization Type Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tashkilot turi
              </Label>
              <div className="flex flex-wrap gap-2">
                {tashkilotTuriOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      filters.tashkilotTuri.includes(option.value)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      handleArrayFilterChange("tashkilotTuri", option.value)
                    }
                    className={`text-xs ${
                      filters.tashkilotTuri.includes(option.value)
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Boshlanish sanasi
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) =>
                      handleFilterChange("dateRange", {
                        ...filters.dateRange,
                        start: e.target.value,
                      })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tugash sanasi
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) =>
                      handleFilterChange("dateRange", {
                        ...filters.dateRange,
                        end: e.target.value,
                      })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Request Range Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Oylik sorovlar soni
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Minimal</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.sorovlarRange.min}
                    onChange={(e) =>
                      handleFilterChange("sorovlarRange", {
                        ...filters.sorovlarRange,
                        min: parseInt(e.target.value) || 0,
                      })
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Maksimal</Label>
                  <Input
                    type="number"
                    placeholder="100000"
                    value={filters.sorovlarRange.max}
                    onChange={(e) =>
                      handleFilterChange("sorovlarRange", {
                        ...filters.sorovlarRange,
                        max: parseInt(e.target.value) || 100000,
                      })
                    }
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Barcha filtrlarni tozalash
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
