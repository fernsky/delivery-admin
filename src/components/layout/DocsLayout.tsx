"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ChevronRight, ArrowLeft, Info, Phone, Send } from "lucide-react";
import SidebarNav from "./SidebarNav";
import { SiteHeader } from "./SiteHeader";
import { Badge } from "@/components/ui/badge";

interface DocsLayoutProps {
  children: React.ReactNode;
  toc?: React.ReactNode;
}

export function DocsLayout({ children, toc }: DocsLayoutProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle mobile detection
  useEffect(() => {
    setIsMounted(true);
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isMounted) return null;

  // Extract current section for breadcrumbs
  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length <= 1) return "तथ्याङ्क प्रोफाइल";

    const section = segments[segments.length - 1]
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return section;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFCFD]">
      <SiteHeader />

      <div className="flex-1">
        <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_200px] md:gap-6 lg:gap-8 mt-4 md:mt-6">
            {/* Mobile sidebar sheet */}
            {isMobile ? (
              <Sheet>
                <div className="flex items-center justify-between mb-4">
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="md:hidden border-[#123772]/20 text-[#123772] hover:bg-[#123772]/5 hover:text-[#123772]"
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle sidebar</span>
                    </Button>
                  </SheetTrigger>
                </div>

                <SheetContent
                  side="left"
                  className="w-[80%] sm:w-[350px] pr-0 z-[100000] border-r-[#123772]/10"
                >
                  <ScrollArea className="h-full py-6 pl-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-[#123772] to-[#0b1f42] text-white">
                        <Info className="w-4 h-4" />
                      </div>
                      <Link
                        href="/profile"
                        className="font-semibold text-[#123772]"
                      >
                        खजुरा प्रोफाइल
                      </Link>
                    </div>
                    <SidebarNav />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            ) : (
              <div className="hidden md:block sticky top-16 self-start h-[calc(100vh-4rem)]">
                <ScrollArea className="h-full pb-10">
                  <div className="pr-2 pt-4">
                    <SidebarNav />
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Main content */}
            <div className="w-full min-w-0 pb-16">
              <main className="relative py-4 lg:py-6">
                <article className="prose prose-slate dark:prose-invert max-w-none">
                  {children}
                </article>
              </main>
            </div>

            {/* Table of contents */}
            {toc && (
              <div className="hidden xl:block">
                <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] pt-10">
                  <ScrollArea className="h-full pb-10">
                    <div className="pt-8 pb-12">
                      <div className="space-y-3 bg-white/80 p-4 rounded-lg shadow-sm border border-[#123772]/10">
                        <p className="font-medium text-[#123772] flex items-center gap-2">
                          <ChevronRight className="w-4 h-4" />
                          विषयसूची
                        </p>
                        <div className="border-l-2 border-[#123772]/10 pl-3">
                          {toc}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t py-6 bg-gradient-to-b from-white to-[#123772]/5 mt-auto">
        <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 md:h-16">
            <p className="text-sm text-[#123772]/70">
              &copy; {new Date().getFullYear()} खजुरा गाउँपालिका। सर्वाधिकार
              सुरक्षित。
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Link
                href="/about"
                className="text-sm flex items-center gap-1 text-[#123772]/70 hover:text-[#123772] transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                हाम्रो बारेमा
              </Link>
              <Link
                href="/contact"
                className="text-sm flex items-center gap-1 text-[#123772]/70 hover:text-[#123772] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                सम्पर्क
              </Link>
              <Link
                href="/feedback"
                className="text-sm flex items-center gap-1 text-[#123772]/70 hover:text-[#123772] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                सुझाव
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
