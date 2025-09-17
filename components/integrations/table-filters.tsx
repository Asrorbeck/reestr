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
// Removed Popover imports - using modal instead
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, ChevronDown, Eye, SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface TableFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onColumnsChange: (columns: string[]) => void;
  selectedColumns: string[];
}

interface FilterState {
  status: string;
  tashkilotShakli: string;
  sorovlarRange: {
    min: number;
    max: number;
  };
}

const statusOptions = [
  { value: "all", label: "Barcha statuslar" },
  { value: "Active", label: "Faol" },
  { value: "Test", label: "Test" },
  { value: "Archived", label: "Arxivlangan" },
];

const tashkilotShakliOptions = [
  { value: "all", label: "Barcha tashkilotlar" },
  { value: "Davlat tashkiloti", label: "Davlat tashkiloti" },
  { value: "Xususiy tashkilot", label: "Xususiy tashkilot" },
];

const columnOptions = [
  { value: "tashkilotShakli", label: "Tashkilot va shakli" },
  { value: "asosiyMaqsad", label: "Asosiy maqsad" },
  { value: "normativHuquqiyHujjat", label: "Normativ-huquqiy hujjat" },
  { value: "texnologikYoriknomaMavjudligi", label: "Texnologik yo'riqnoma" },
  { value: "texnologiya", label: "Texnologiya" },
  { value: "maqlumotAlmashishSharti", label: "Ma'lumot almashish sharti" },
  { value: "sorovlarOrtachaOylik", label: "Oylik sorovlar" },
  { value: "qaysiTashkilotTomondan", label: "Ma'lumot beruvchi" },
  { value: "mspdManzil", label: "MSPD manzili" },
  { value: "axborotTizimiNomi", label: "Axborot tizimi" },
  { value: "status", label: "Status" },
];

export default function TableFilters({
  onFiltersChange,
  onColumnsChange,
  selectedColumns,
}: TableFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isColumnOpen, setIsColumnOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    tashkilotShakli: "all",
    sorovlarRange: { min: 0, max: 100000 },
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleColumnToggle = (columnValue: string) => {
    const newColumns = selectedColumns.includes(columnValue)
      ? selectedColumns.filter((col) => col !== columnValue)
      : [...selectedColumns, columnValue];
    onColumnsChange(newColumns);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      status: "all",
      tashkilotShakli: "all",
      sorovlarRange: { min: 0, max: 100000 },
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status && filters.status !== "all") count++;
    if (filters.tashkilotShakli && filters.tashkilotShakli !== "all") count++;
    if (filters.sorovlarRange.min > 0 || filters.sorovlarRange.max < 100000)
      count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="mb-4 border-0 shadow-sm bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-4">
          {/* Column Selector */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsColumnOpen(!isColumnOpen)}
            className="h-9 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ustunlar
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>

          {/* Column Selector Modal */}
          {isColumnOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-80 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Ustunlarni tanlang</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onColumnsChange(columnOptions.map((col) => col.value))
                        }
                        className="text-xs h-7 px-2"
                      >
                        Barchasini tanlash
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsColumnOpen(false)}
                        className="text-xs h-7 px-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {columnOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={option.value}
                          checked={selectedColumns.includes(option.value)}
                          onCheckedChange={() =>
                            handleColumnToggle(option.value)
                          }
                        />
                        <Label
                          htmlFor={option.value}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Filters */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="h-9 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filterlar
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                {activeFiltersCount}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>

          {/* Filter Modal */}
          {isFilterOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Filterlar</h4>
                    <div className="flex gap-2">
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50 text-xs h-7 px-2"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Tozalash
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFilterOpen(false)}
                        className="text-xs h-7 px-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Status Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </Label>
                      <Select
                        value={filters.status}
                        onValueChange={(value) =>
                          handleFilterChange("status", value)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Status tanlang" />
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

                    {/* Organization Type Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tashkilot shakli
                      </Label>
                      <Select
                        value={filters.tashkilotShakli}
                        onValueChange={(value) =>
                          handleFilterChange("tashkilotShakli", value)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Tashkilot shaklini tanlang" />
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

                    {/* Request Range Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Oylik sorovlar soni
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            type="number"
                            placeholder="Min"
                            value={filters.sorovlarRange.min || ""}
                            onChange={(e) =>
                              handleFilterChange("sorovlarRange", {
                                ...filters.sorovlarRange,
                                min: parseInt(e.target.value) || 0,
                              })
                            }
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={filters.sorovlarRange.max || ""}
                            onChange={(e) =>
                              handleFilterChange("sorovlarRange", {
                                ...filters.sorovlarRange,
                                max: parseInt(e.target.value) || 100000,
                              })
                            }
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
