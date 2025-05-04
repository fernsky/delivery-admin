"use client";

import { useEffect, useState, useRef } from "react";
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
  const observer = useRef<IntersectionObserver | null>(null);
  const headingElementsRef = useRef<{
    [key: string]: IntersectionObserverEntry;
  }>({});

  useEffect(() => {
    if (toc.length === 0) return;

    const headingElements = toc
      .map(({ slug }) => document.getElementById(slug))
      .filter(Boolean);

    // Create an Intersection Observer instance
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          headingElementsRef.current[id] = entry;
        });

        // Find the first heading that is visible
        const visibleHeadings = Object.keys(headingElementsRef.current)
          .filter((id) => headingElementsRef.current[id]?.isIntersecting)
          .sort((a, b) => {
            // Sort by Y position to get the topmost visible heading
            const aTop =
              headingElementsRef.current[a]?.boundingClientRect.top || 0;
            const bTop =
              headingElementsRef.current[b]?.boundingClientRect.top || 0;
            return aTop - bTop;
          });

        if (visibleHeadings.length > 0) {
          setActiveHeading(visibleHeadings[0]);

          // Update URL hash without scrolling
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.hash = visibleHeadings[0];
            window.history.replaceState({}, "", url);
          }
        }
      },
      { rootMargin: "-80px 0px -40% 0px", threshold: [0.1, 0.5, 0.9] },
    );

    // Observe all heading elements
    headingElements.forEach((element) => {
      if (element) observer.current?.observe(element);
    });

    return () => {
      headingElements.forEach((element) => {
        if (element) observer.current?.unobserve(element);
      });

      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [toc, pathname]);

  if (toc.length === 0) return null;

  // Find deepest nesting level for proper indentation
  const deepestLevel = toc.reduce(
    (deep, item) => Math.max(deep, item.level),
    0,
  );

  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-0 w-px bg-muted" />
      <div className="space-y-1">
        {toc.map((heading) => {
          const levelIndent = heading.level > 2 ? (heading.level - 2) * 12 : 0;

          return (
            <div key={heading.slug} style={{ paddingLeft: `${levelIndent}px` }}>
              <a
                href={`#${heading.slug}`}
                className={cn(
                  "block text-sm py-1 pl-3 border-l-2 transition-all hover:text-foreground relative",
                  activeHeading === heading.slug
                    ? "text-primary border-primary font-medium"
                    : "text-muted-foreground border-transparent hover:border-muted-foreground/40",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.slug);
                  if (element) {
                    // Scroll to the element with offset for fixed header
                    const yOffset = -100;
                    const y =
                      element.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }

                  setActiveHeading(heading.slug);

                  // Update URL hash
                  if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    url.hash = heading.slug;
                    window.history.pushState({}, "", url);
                  }
                }}
              >
                {heading.text}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
