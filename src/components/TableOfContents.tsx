"use client";

import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface TableOfContentsProps {
  toc: Array<{
    level: number;
    text: string;
    slug: string;
  }>;
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const pathname = usePathname();
  const [activeHeading, setActiveHeading] = useState<string>("");

  useEffect(() => {
    if (toc.length === 0) return;

    const headingElements = toc
      .map(({ slug }) => document.getElementById(slug))
      .filter(Boolean);

    const headingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;

          if (entry.isIntersecting) {
            setActiveHeading(id);

            // Update the URL hash without scrolling
            const url = new URL(window.location.href);
            url.hash = id;
            window.history.replaceState({}, "", url);
          }
        });
      },
      {
        rootMargin: "0px 0px -80% 0px",
        threshold: 1.0,
      },
    );

    headingElements.forEach((element) => {
      if (element) headingObserver.observe(element);
    });

    return () => {
      headingElements.forEach((element) => {
        if (element) headingObserver.unobserve(element);
      });
    };
  }, [toc, pathname]);

  if (toc.length === 0) return null;

  return (
    <div className="space-y-2">
      {toc.map((heading) => {
        return (
          <a
            key={heading.slug}
            href={`#${heading.slug}`}
            className={cn(
              "block text-sm transition-colors hover:text-foreground",
              heading.level === 2 ? "pl-0" : "pl-4",
              activeHeading === heading.slug
                ? "font-medium text-primary"
                : "text-muted-foreground",
            )}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(heading.slug)?.scrollIntoView({
                behavior: "smooth",
              });
              setActiveHeading(heading.slug);

              // Update URL hash
              const url = new URL(window.location.href);
              url.hash = heading.slug;
              window.history.pushState({}, "", url);
            }}
          >
            {heading.text}
          </a>
        );
      })}
    </div>
  );
}
