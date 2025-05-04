import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold inline-block">स्थानीय प्रोफाइल</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <Link
                href="/profile"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                पालिका प्रोफाइल
              </Link>
              <Link
                href="/profile/demographics"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                जनसांख्यिकी
              </Link>
              <Link
                href="/profile/education"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                शिक्षा
              </Link>
              <Link
                href="/profile/health"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                स्वास्थ्य
              </Link>
              <Link
                href="/maps"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                नक्सा
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/api/auth/signin"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "px-4",
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
