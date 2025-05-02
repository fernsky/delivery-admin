import useStore from "../../_store/app-store";
import React from "react";

interface SectionProps {
  sectionId: string;
  sectionName: string;
  index: number;
  totalSections: number;
}

const Section: React.FC<SectionProps> = ({
  sectionId,
  sectionName,
  index,
  totalSections,
}) => {
  const currentSectionId = useStore((state) => state.currentSectionId);
  const setCurrentSectionId = useStore((state) => state.setCurrentSectionId);
  const isLastSection = React.useMemo(() => {
    return index === totalSections - 1;
  }, [index, totalSections]);

  const isSectionSelected = React.useMemo(() => {
    return sectionId == currentSectionId;
  }, [sectionId, currentSectionId]);

  const handleClick = () => {
    setCurrentSectionId(sectionId);
  };

  return (
    <React.Fragment>
      <div
        className={`cursor-pointer w-[258px] p-[8px] ${
          !isLastSection ? "border-b-[#E1E1E1] border-b-[1px]" : ""
        } ${
          isSectionSelected ? "bg-[#F5F5F5] text-[#414141]" : "text-[#656565]"
        }`}
        onClick={handleClick}
      >
        <span className="w-[160px] text-[12px] tracking-[-0.2px] font-[430]">
          {sectionName}
        </span>
      </div>
    </React.Fragment>
  );
};

export default Section;
