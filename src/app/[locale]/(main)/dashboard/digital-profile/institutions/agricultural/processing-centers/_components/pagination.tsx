"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Calculate page ranges to show
  const getPageRange = () => {
    const delta = 2; // Number of pages to show before and after current page
    const pages = [];
    const leftOffset = Math.max(1, currentPage - delta);
    const rightOffset = Math.min(totalPages, currentPage + delta);

    // Always show first page
    if (leftOffset > 1) {
      pages.push(1);

      // If not directly connected to first page, show ellipsis
      if (leftOffset > 2) {
        pages.push("ellipsis_start");
      }
    }

    // Add pages around current page
    for (let i = leftOffset; i <= rightOffset; i++) {
      pages.push(i);
    }

    // Always show last page
    if (rightOffset < totalPages) {
      // If not directly connected to last page, show ellipsis
      if (rightOffset < totalPages - 1) {
        pages.push("ellipsis_end");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pageRange = getPageRange();

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
        <span className="sr-only">पहिलो पृष्ठ</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">अघिल्लो पृष्ठ</span>
      </Button>

      {pageRange.map((page, index) => {
        if (page === "ellipsis_start" || page === "ellipsis_end") {
          return (
            <div
              key={`ellipsis_${index}`}
              className="h-8 w-8 flex items-center justify-center"
            >
              <span>...</span>
            </div>
          );
        }

        return (
          <Button
            key={`page_${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page as number)}
          >
            {page}
            <span className="sr-only">{`पृष्ठ ${page}`}</span>
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">अर्को पृष्ठ</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
        <span className="sr-only">अन्तिम पृष्ठ</span>
      </Button>
    </div>
  );
}
