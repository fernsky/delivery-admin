import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Download, Book, FileText, Search, Users } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container px-4 sm:px-6 max-w-7xl mx-auto flex h-14 items-center">
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <span className="font-bold inline-block text-lg">
              खजुरा डिजिटल प्रोफाइल
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
