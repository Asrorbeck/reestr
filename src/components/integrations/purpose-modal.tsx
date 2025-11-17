"use client";

import type { Integration } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PurposeModalProps {
  integration: Integration | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PurposeModal({
  integration,
  isOpen,
  onClose,
}: PurposeModalProps) {
  if (!integration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Asosiy maqsad
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {integration.nomi}
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {integration.vazirlik} • {integration.tashkilotShakli}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Asosiy maqsad:
            </h4>
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
              {integration.asosiyMaqsad}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
