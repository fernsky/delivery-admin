"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface Section {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: Section[];
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string | null>(
    sections.length > 0 ? sections[0].id : null,
  );

  // Track scrolling and update active section
  useEffect(() => {
    const handleScroll = () => {
      // Determine which section is currently in view
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Adjust for header height
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">विषय सूची</h3>
      <nav className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`w-full text-left flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              activeSection === section.id
                ? "bg-green-50 text-green-700 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <ChevronRight
              className={`mr-2 h-4 w-4 transition-transform ${
                activeSection === section.id ? "transform rotate-90" : ""
              }`}
            />
            {section.title}
          </button>
        ))}
      </nav>
    </div>
  );
}
