import useStore from "../../_store/app-store";
import { ChevronDown, ChevronRight } from "lucide-react";
import React from "react";
import { SectionLabel } from "./profile-sidebar";
import Section from "./section";

interface ChapterProps {
  chapterId: string;
  chapterName: string;
  sections: SectionLabel[];
}

const Chapter: React.FC<ChapterProps> = ({
  chapterName,
  chapterId,
  sections,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const currentChapterId = useStore((state) => state.currentChapterId);
  const setCurrentChapterId = useStore((state) => state.setCurrentChapterId);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    setCurrentChapterId(chapterId);
  };

  const isChapterSelected = React.useMemo(() => {
    return currentChapterId == chapterId;
  }, [chapterId, currentChapterId]);

  return (
    <React.Fragment>
      <div>
        <div
          onClick={handleClick}
          className={`cursor-pointer tracking-[-0.5px] rounded-[8px] flex justify-between items-center w-[274px] pl-[16px] pr-[8px] py-[14px]  ${
            isChapterSelected
              ? "bg-[#f3f3f3] text-[#4b4b4b] font-[500]"
              : "bg-[#f3f3f3] text-[#4b4b4b] font-[500]"
          }`}
        >
          <span className="w-[160px] text-[13px] ">{chapterName}</span>
          {isExpanded ? (
            <ChevronDown className="w-[16px] h-[16px]" />
          ) : (
            <ChevronRight className="w-[16px] h-[16px]" />
          )}
        </div>
        {isExpanded && sections.length > 0 ? (
          <div className="px-[16px] py-[20px] flex flex-col gap-0">
            {sections?.map((section, index) => (
              <Section
                key={section.id}
                sectionId={section.id}
                sectionName={section.sectionName}
                index={index}
                totalSections={sections.length}
              />
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </React.Fragment>
  );
};

export default Chapter;
