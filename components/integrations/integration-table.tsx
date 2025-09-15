"use client";

import type { Integration } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface IntegrationTableProps {
  integrations: Integration[];
  onView?: (integration: Integration) => void;
  userRole?: "Administrator" | "Operator" | "Viewer";
}

const statusColors = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Test: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function IntegrationTable({
  integrations,
  onView,
  userRole = "Administrator",
}: IntegrationTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nomi</TableHead>
            <TableHead>Vazirlik</TableHead>
            <TableHead>Huquqiy asos</TableHead>
            <TableHead>Registratsiya raqami</TableHead>
            <TableHead>Yo'nalish</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Muddat</TableHead>
            <TableHead className="text-right">Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {integrations.map((integration) => (
            <TableRow key={integration.id}>
              <TableCell className="font-medium">{integration.nomi}</TableCell>
              <TableCell>{integration.vazirlik}</TableCell>
              <TableCell
                className="max-w-xs truncate"
                title={integration.huquqiyAsos}
              >
                {integration.huquqiyAsos}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {integration.id}
              </TableCell>
              <TableCell>{integration.yonalish}</TableCell>
              <TableCell>
                <Badge
                  className={cn("text-xs", statusColors[integration.status])}
                >
                  {integration.status}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDate(integration.sana)} -{" "}
                {formatDate(integration.muddat)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView?.(integration)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ko'rish
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
