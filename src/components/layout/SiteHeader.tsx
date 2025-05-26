import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Mountain, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-sm shadow-md"
          : "bg-white border-b border-[#123772]/10"
      }`}
    >
      <div
        className={`container px-4 sm:px-6 max-w-7xl mx-auto transition-all duration-300 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#123772] to-[#0b1f42] text-white group-hover:shadow-lg group-hover:shadow-[#123772]/25 transition-all duration-300">
              <Mountain className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-gray-900">
                खजुरा
              </span>
              <Badge
                variant="outline"
                className="hidden sm:flex items-center gap-1 mt-1 border-gray-200"
              >
                <Sparkles className="w-3 h-3" />
                <span className="text-[10px]">गाउँपालिका</span>
              </Badge>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden md:flex text-[#123772] border-[#123772]/20 hover:bg-[#123772]/5 hover:text-[#123772]"
              )}
            >
              प्रोफाइल
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
