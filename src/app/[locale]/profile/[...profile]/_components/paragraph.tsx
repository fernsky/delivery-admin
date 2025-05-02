import React from "react";

interface ParagraphProps {
  children: React.ReactNode;
}

const Paragraph: React.FC<ParagraphProps> = ({ children }) => {
  return (
    <p className="text-justify text-[16px] text-[#343434] tracking-[-0.7px] font-[420] px-[16px]">
      {children}
    </p>
  );
};

export default Paragraph;
