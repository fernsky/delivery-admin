import React from "react";

interface TitleProps {
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ children }) => {
  return (
    <h1 className="text-[24px] font-[600] tracking-[-0.5px] py-[16px] px-[16px]">
      {children}
    </h1>
  );
};

export default Title;
