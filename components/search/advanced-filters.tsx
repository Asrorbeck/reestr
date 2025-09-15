"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react"

interface FilterState {
  vazirlik: string
  texnologiya: string
  status: string
  yonalish: string
  dateFrom: string
  dateTo: string
}

interface AdvancedFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
}

const ministries = [
  "Moliya vazirligi",
  "Soliq qo'mitasi",
  "Statistika qo'mitasi",
  "Iqtisodiyot vazirligi",
  "Adliya vazirligi",
]

export function AdvancedFilters({ filters, onFiltersChange, onClearFilters }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Kengaytirilgan qidiruv
                {hasActiveFilters && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">Faol</span>
                )}
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Vazirlik/Tashkilot</Label>
                <Select value={filters.vazirlik} onValueChange={(value) => handleFilterChange("vazirlik", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barchasi</SelectItem>
                    {ministries.map((ministry) => (
                      <SelectItem key={ministry} value={ministry}>
                        {ministry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Texnologiya</Label>
                <Select value={filters.texnologiya} onValueChange={(value) => handleFilterChange("texnologiya", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barchasi</SelectItem>
                    <SelectItem value="REST">REST</SelectItem>
                    <SelectItem value="SOAP">SOAP</SelectItem>
                    <SelectItem value="MQ">MQ</SelectItem>
                    <SelectItem value="File exchange">File exchange</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barchasi</SelectItem>
                    <SelectItem value="Active">Faol</SelectItem>
                    <SelectItem value="Test">Test</SelectItem>
                    <SelectItem value="Archived">Arxivlangan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Yo'nalish</Label>
                <Select value={filters.yonalish} onValueChange={(value) => handleFilterChange("yonalish", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barchasi</SelectItem>
                    <SelectItem value="One-way">Bir tomonlama</SelectItem>
                    <SelectItem value="Two-way">Ikki tomonlama</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Boshlanish sanasi (dan)</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Boshlanish sanasi (gacha)</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={onClearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Filtrlarni tozalash
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
