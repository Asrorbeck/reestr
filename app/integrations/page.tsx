"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Integration } from "@/lib/types";
import { mockIntegrations } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IntegrationCard } from "@/components/integrations/integration-card";
import { IntegrationTable } from "@/components/integrations/integration-table";
import { IntegrationForm } from "@/components/integrations/integration-form";
import { RoleGuard } from "@/components/auth/role-guard";
import { Plus, Search, Grid3X3, Table as TableIcon } from "lucide-react";

export default function IntegrationsPage() {
  const router = useRouter();
  const [integrations, setIntegrations] =
    useState<Integration[]>(mockIntegrations);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIntegration, setEditingIntegration] =
    useState<Integration | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const filteredIntegrations = integrations.filter(
    (integration) =>
      integration.nomi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.vazirlik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.texnologiya.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (integration: Integration) => {
    router.push(`/integrations/${integration.id}`);
  };

  const handleEdit = (integration: Integration) => {
    setEditingIntegration(integration);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingIntegration(null);
    setShowForm(true);
  };

  const handleSave = (integrationData: Partial<Integration>) => {
    if (editingIntegration) {
      // Update existing integration
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === editingIntegration.id
            ? {
                ...item,
                ...integrationData,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
    } else {
      // Add new integration
      const { id, ...integrationDataWithoutId } =
        integrationData as Integration;
      const newIntegration: Integration = {
        id: Date.now().toString(),
        ...integrationDataWithoutId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setIntegrations((prev) => [newIntegration, ...prev]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integratsiyalar</h1>
          <p className="text-muted-foreground">
            Markaziy Bank va vazirliklar o'rtasidagi integratsiyalar reestri
          </p>
        </div>

        <RoleGuard allowedRoles={["Administrator", "Operator"]}>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Yangi integratsiya
          </Button>
        </RoleGuard>
      </div>

      {/* Search and View Toggle */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Integratsiyalarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={viewMode === "card" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("card")}
            className="h-8 px-3"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="h-8 px-3"
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Integration Content */}
      {viewMode === "card" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onView={handleView}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <IntegrationTable
          integrations={filteredIntegrations}
          onView={handleView}
          onEdit={handleEdit}
        />
      )}

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm
              ? "Qidiruv bo'yicha natija topilmadi"
              : "Hech qanday integratsiya topilmadi"}
          </p>
        </div>
      )}

      {/* Form Modal */}
      <IntegrationForm
        integration={editingIntegration}
        open={showForm}
        onOpenChange={setShowForm}
        onSave={handleSave}
      />
    </div>
  );
}
