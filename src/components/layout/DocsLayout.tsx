"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, X } from "lucide-react";
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

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_200px] md:gap-6 lg:gap-10 mt-6">
        {/* Mobile sidebar sheet */}
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden mb-4">
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
                <div className="flex items-center px-3 mb-4">
                  <Search className="h-4 w-4 mr-2 opacity-50" />
                  <input
                    type="text"
                    placeholder="खोज्नुहोस्..."
                    className="flex-1 bg-transparent outline-none"
                  />
                </div>
                <SidebarNav />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="md:sticky top-16 md:self-start">
            <div className="hidden md:block">
              <div className="relative">
                <div className="flex items-center px-3 mb-4">
                  <Search className="h-4 w-4 mr-2 opacity-50" />
                  <input
                    type="text"
                    placeholder="खोज्नुहोस्..."
                    className="flex-1 bg-transparent outline-none border-b border-gray-200 pb-1"
                  />
                </div>
                <SidebarNav />
              </div>
            </div>
          </div>
        )}

        <div className="md:max-w-4xl pb-16">
          <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px]">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              {children}
            </article>
            {toc && (
              <div className="hidden text-sm xl:block">
                <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] pt-10">
                  <ScrollArea className="h-full pb-10">
                    <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
                      <div className="space-y-2">
                        <p className="font-medium">विषयसूची</p>
                        {toc}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col sm:flex-row items-center justify-between py-4 md:h-16">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} स्थानीय प्रोफाइल पोर्टल।
            सर्वाधिकार सुरक्षित।
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="/about"
              className="text-sm text-gray-500 hover:underline"
            >
              हाम्रो बारेमा
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-500 hover:underline"
            >
              सम्पर्क
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
