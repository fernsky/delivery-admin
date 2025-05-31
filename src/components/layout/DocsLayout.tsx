import { ScrollArea } from "@/components/ui/scroll-area";

interface DocsLayoutProps {
  children: React.ReactNode;
  toc?: React.ReactNode;
}

export function DocsLayout({ children, toc }: DocsLayoutProps) {
  return (
    <div className="flex-1">
      <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:grid md:grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_220px] md:gap-6 lg:gap-8 mt-4 md:mt-6">
          {/* Spacer for desktop sidebar */}
        

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
            <div className="hidden xl:block w-full">
              <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] pt-10 w-full">
                <ScrollArea className="h-full pb-10 w-full">
                  <div className="pt-8 pb-12 w-full">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5 text-[#123772]">
                        <span className="font-medium">विषयसूची</span>
                      </div>
                      <div className="pl-4 border-l-2 border-[#123772]/10">
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
  );
}
