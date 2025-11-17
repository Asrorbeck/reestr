"use client";

import {
  useRef,
  useEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { Eye } from "lucide-react";

interface TruncatedTextCellProps {
  value: string;
  label: string;
  onViewFullText: (e: ReactMouseEvent, title: string, value: string) => void;
  cellClassName?: string;
  textClassName?: string;
  maxWidth?: string;
  showButton?: boolean; // "Davomini o'qish" button'ni ko'rsatish/yashirish
  extraActions?: ReactNode;
}

export function TruncatedTextCell({
  value,
  label,
  onViewFullText,
  cellClassName = "",
  textClassName = "",
  maxWidth = "max-w-sm",
  showButton = true,
  extraActions,
}: TruncatedTextCellProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const isOverflowing =
          textRef.current.scrollWidth > textRef.current.clientWidth ||
          textRef.current.scrollHeight > textRef.current.clientHeight;
        setIsTruncated(isOverflowing);
      }
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [value]);

  return (
    <div className={`${cellClassName}`}>
      <div className="flex flex-col gap-1">
        <div
          ref={textRef}
          className={`truncate ${maxWidth} ${textClassName}`}
          title={value}
        >
          {value}
        </div>
        {(isTruncated || extraActions) && (
          <div className="flex items-center gap-2">
            {isTruncated && showButton && (
              <button
                onClick={(e) => onViewFullText(e, label, value)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-xs text-blue-600 transition-colors hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/50 dark:hover:border-blue-700 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                title="Davomini o'qish"
                type="button"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Davomini o'qish</span>
              </button>
            )}
            {extraActions}
          </div>
        )}
      </div>
    </div>
  );
}

