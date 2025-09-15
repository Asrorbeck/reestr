"use client";

import type { Integration } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Building2, FileText, Hash, Eye } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface IntegrationCardProps {
  integration: Integration;
  onView?: (integration: Integration) => void;
  userRole?: "Administrator" | "Operator" | "Viewer";
}

const statusColors = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Test: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function IntegrationCard({
  integration,
  onView,
  userRole = "Administrator",
}: IntegrationCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">
            {integration.nomi}
          </CardTitle>
          <Badge
            className={cn(
              "ml-2 flex-shrink-0",
              statusColors[integration.status]
            )}
          >
            {integration.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">Vazirlik:</span>
            <span className="text-muted-foreground">
              {integration.vazirlik}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">Huquqiy asos:</span>
            <span className="text-muted-foreground text-xs">
              {integration.huquqiyAsos}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">Registratsiya raqami:</span>
            <span className="text-muted-foreground font-mono text-xs">
              {integration.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">Muddat:</span>
            <span className="text-muted-foreground">
              {formatDate(integration.sana)} - {formatDate(integration.muddat)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(integration)}
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ko'rish
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
