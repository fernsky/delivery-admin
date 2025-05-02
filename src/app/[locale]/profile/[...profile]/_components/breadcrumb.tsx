"use client";
import React from "react";
import { ChevronRight } from "lucide-react";

const BreadCrumb: React.FC = ({}) => {
  const items = [
    "Introduction",
    "Historical Background and Naming",
    "Major Settlement Areas",
  ];
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex gap-[8px]">
        {items.map((item, index) => (
          <li key={index} className="flex gap-[8px] items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-500" />}
            <span
              className={`cursor-pointer tracking-[-0.8px] ${
                index === items.length - 1
                  ? "font-[600] text-[#2B2B2B]"
                  : "text-[#787878] font-[500]"
              }`}
            >
              {item}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
