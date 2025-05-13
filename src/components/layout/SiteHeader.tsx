import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Download, Book, FileText, Search, Users } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container px-4 sm:px-6 max-w-7xl mx-auto flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 shrink-0">
              <span className="font-bold inline-block text-lg">
                तथ्याङ्क पोर्टल
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <Link
                href="/profile"
                className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>पालिका प्रोफाइल</span>
              </Link>
              <Link
                href="/profile/demographics"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1"
              >
                <Users className="h-3.5 w-3.5" />
                <span>जनसांख्यिकी</span>
              </Link>
              <Link
                href="/profile/education"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1"
              >
                <Book className="h-3.5 w-3.5" />
                <span>शिक्षा</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex relative rounded-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="खोज्नुहोस्..."
                className="pl-8 h-9 md:w-[180px] lg:w-[280px] rounded-md border border-input bg-transparent text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
              />
            </div>

            <Link
              href="/downloads"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden md:flex gap-1",
              )}
            >
              <Download className="h-4 w-4" />
              डाउनलोड
            </Link>

            <Link
              href="/api/auth/signin"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "px-3",
              )}
            >
              प्रवेश
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
