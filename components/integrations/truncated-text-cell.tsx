"use client";

import { useRef, useEffect, useState } from "react";
import { TableCell } from "@/components/ui/table";

interface TruncatedTextCellProps {
  value: string;
  label: string;
  onViewFullText: (e: React.MouseEvent, title: string, value: string) => void;
  cellClassName?: string;
  textClassName?: string;
  maxWidth?: string;
  showButton?: boolean; // "Davomini o'qish" button'ni ko'rsatish/yashirish
}

export function TruncatedTextCell({
  value,
  label,
  onViewFullText,
  cellClassName = "",
  textClassName = "",
  maxWidth = "max-w-sm",
  showButton = true,
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
        {isTruncated && showButton && (
          <button
            onClick={(e) => onViewFullText(e, label, value)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-xs underline flex-shrink-0 cursor-pointer w-fit"
            title="To'liq o'qish"
          >
            Davomini o'qish
          </button>
        )}
      </div>
    </div>
  );
}

