"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, X, ChevronRight } from "lucide-react";
import SidebarNav from "./SidebarNav";
import { SiteHeader } from "./SiteHeader";

interface DocsLayoutProps {
  children: React.ReactNode;
  toc?: React.ReactNode;
}

export function DocsLayout({ children, toc }: DocsLayoutProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

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
    if (segments.length <= 1) return "तथ्याङ्क पोर्टल";

    const section = segments[segments.length - 1]
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return section;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <div className="flex-1">
        <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_220px] md:gap-6 lg:gap-8 mt-4 md:mt-6">
            {/* Mobile sidebar sheet */}
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden mb-4"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle sidebar</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80%] sm:w-[350px] pr-0">
                  <ScrollArea className="h-full py-6 pl-6">
                    <div className="flex items-center mb-6">
                      <Link href="/profile" className="font-semibold">
                        स्थानीय प्रोफाइल
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4"
                        asChild
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="खोज्नुहोस्..."
                        className="w-full rounded-md pl-9 border border-input bg-background py-2 text-sm"
                      />
                    </div>
                    <SidebarNav />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            ) : (
              <div className="hidden md:block sticky top-16 self-start h-[calc(100vh-4rem)]">
                <ScrollArea className="h-full pb-10">
                  <div className="pr-2 pt-4">
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="खोज्नुहोस्..."
                        className="w-full rounded-md pl-9 border border-input bg-background py-2 text-sm focus-within:ring-1 focus-within:ring-ring"
                      />
                    </div>
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
                      <div className="space-y-2">
                        <p className="font-medium">विषयसूची</p>
                        {toc}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t py-6 bg-slate-50 dark:bg-slate-900 mt-auto">
        <div className="container px-4 sm:px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between py-4 md:h-16">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} स्थानीय तथ्याङ्क पोर्टल।
            सर्वाधिकार सुरक्षित।
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              हाम्रो बारेमा
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              सम्पर्क
            </Link>
            <Link
              href="/feedback"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              सुझाव
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
