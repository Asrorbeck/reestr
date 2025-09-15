"use client";

import type { IntegrationVersion } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, User, FileText, Eye } from "lucide-react";

interface VersionHistoryProps {
  versions: IntegrationVersion[];
  onViewVersion?: (version: IntegrationVersion) => void;
}

export function VersionHistory({
  versions,
  onViewVersion,
}: VersionHistoryProps) {
  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Versiya tarixi</CardTitle>
        <CardDescription>
          Integratsiya o'zgarishlari tarixi va versiyalari
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedVersions.map((version, index) => (
            <div key={version.id} className="relative">
              {/* Timeline line */}
              {index < sortedVersions.length - 1 && (
                <div className="absolute left-4 top-8 h-full w-px bg-border" />
              )}

              <div className="flex items-start space-x-4">
                {/* Version badge */}
                <div className="flex-shrink-0">
                  <Badge
                    variant={index === 0 ? "default" : "secondary"}
                    className="h-8 w-8 rounded-full p-0 flex items-center justify-center"
                  >
                    v{version.version}
                  </Badge>
                </div>

                {/* Version details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">
                        Versiya {version.version}
                        {index === 0 && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Joriy
                          </Badge>
                        )}
                      </h4>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewVersion?.(version)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ko'rish
                    </Button>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      {version.changedBy}
                      <Clock className="h-3 w-3 ml-4 mr-1" />
                      {new Date(version.changedAt).toLocaleString("en-GB")}
                    </div>

                    {version.changeReason && (
                      <div className="flex items-start text-sm">
                        <FileText className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {version.changeReason}
                        </span>
                      </div>
                    )}

                    {/* Changed fields */}
                    {Object.keys(version.data).length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          O'zgargan maydonlar:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {Object.keys(version.data).map((field) => (
                            <Badge
                              key={field}
                              variant="outline"
                              className="text-xs"
                            >
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {index < sortedVersions.length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}
        </div>

        {versions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Versiya tarixi mavjud emas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
