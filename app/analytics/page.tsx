"use client"

import { useState, useEffect } from "react"
import type { Integration } from "@/lib/types"
import { supabaseUtils } from "@/lib/supabaseUtils"
import { AdvancedFilters } from "@/components/search/advanced-filters"
import { EfficiencyChart } from "@/components/analytics/efficiency-chart"
import { MinistryActivity } from "@/components/analytics/ministry-activity"
import { StatsChart } from "@/components/monitoring/stats-chart"
import { IntegrationCard } from "@/components/integrations/integration-card"
import { IntegrationModal } from "@/components/integrations/integration-modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Download, TrendingUp, BarChart3 } from "lucide-react"

interface FilterState {
  vazirlik: string
  texnologiya: string
  status: string
  yonalish: string
  dateFrom: string
  dateTo: string
}

export default function AnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [filters, setFilters] = useState<FilterState>({
    vazirlik: "",
    texnologiya: "",
    status: "",
    yonalish: "",
    dateFrom: "",
    dateTo: "",
  })

  useEffect(() => {
    const loadIntegrations = async () => {
      try {
        const savedIntegrations = await supabaseUtils.getIntegrations();
        setIntegrations(savedIntegrations);
      } catch (error) {
        console.error("Integratsiyalarni yuklashda xatolik:", error);
        setIntegrations([]);
      }
    };
    loadIntegrations();
  }, [])

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.axborotTizimiNomi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.tashkilotNomiVaShakli.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilters =
      (!filters.vazirlik || integration.tashkilotNomiVaShakli.includes(filters.vazirlik)) &&
      (!filters.texnologiya || integration.malumotFormati === filters.texnologiya) &&
      (!filters.status || integration.status === filters.status) &&
      (!filters.yonalish) &&
      (!filters.dateFrom) &&
      (!filters.dateTo)

    return matchesSearch && matchesFilters
  })

  const handleView = (integration: Integration) => {
    setSelectedIntegration(integration)
    setShowModal(true)
  }

  const clearFilters = () => {
    setFilters({
      vazirlik: "",
      texnologiya: "",
      status: "",
      yonalish: "",
      dateFrom: "",
      dateTo: "",
    })
  }

  // Analytics data
  const technologyStats = integrations.reduce(
    (acc, integration) => {
      acc[integration.malumotFormati] = (acc[integration.malumotFormati] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const technologyData = Object.entries(technologyStats).map(([name, value]) => ({
    name,
    value,
  }))

  const statusStats = integrations.reduce(
    (acc, integration) => {
      acc[integration.status] = (acc[integration.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const statusData = Object.entries(statusStats).map(([name, value]) => ({
    name: name === "faol" ? "Faol" : name === "testda" ? "Testda" : name === "rejalashtirilgan" ? "Rejalashtirilgan" : "Muammoli",
    value,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Qidiruv va Analitika</h1>
          <p className="text-muted-foreground">Integratsiyalarni qidirish va tahlil qilish</p>
        </div>

        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Hisobotni yuklab olish
        </Button>
      </div>

      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami integratsiyalar</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
            <p className="text-xs text-muted-foreground">Ro'yxatga olingan barcha integratsiyalar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faol integratsiyalar</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {integrations.filter((i) => i.status === "faol").length}
            </div>
            <p className="text-xs text-muted-foreground">Hozirda ishlab turgan integratsiyalar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O'rtacha samaradorlik</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">98.8%</div>
            <p className="text-xs text-muted-foreground">Oxirgi 30 kun davomida</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qidiruv natijalari</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredIntegrations.length}</div>
            <p className="text-xs text-muted-foreground">Filtr va qidiruv bo'yicha topilgan</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <EfficiencyChart />
        <MinistryActivity />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <StatsChart
          title="Texnologiyalar bo'yicha taqsimot"
          description="Qo'llaniladigan texnologiyalar statistikasi"
          data={technologyData}
          color="hsl(var(--chart-2))"
        />

        <StatsChart
          title="Status bo'yicha taqsimot"
          description="Integratsiyalar holati statistikasi"
          data={statusData}
          color="hsl(var(--chart-3))"
        />
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Integratsiyalarni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <AdvancedFilters filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} />
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Qidiruv natijalari ({filteredIntegrations.length})</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} onView={handleView} />
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Qidiruv bo'yicha natija topilmadi</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <IntegrationModal integration={selectedIntegration} open={showModal} onOpenChange={setShowModal} />
    </div>
  )
}
