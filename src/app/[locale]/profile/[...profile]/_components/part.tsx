"use client";
import React from "react";
import { ChevronDown, ChevronRight, icons } from "lucide-react";
import { ChapterLabel } from "./profile-sidebar";
import Chapter from "./chapter";
import useStore from "../../_store/app-store";

export type PartIcon =
  | "Info"
  | "CircleDollarSign"
  | "Users"
  | "PersonStanding"
  | "TreePine"
  | "Building"
  | "Landmark";

interface PartProps {
  partId: string;
  iconName: PartIcon;
  partName: string;
  chapters: ChapterLabel[];
}

const Part: React.FC<PartProps> = ({
  partId,
  iconName,
  partName,
  chapters,
}) => {
  const LucideIcon = icons[iconName];
  const [isExpanded, setExpanded] = React.useState(false);
  const currentPartId = useStore((state) => state.currentPartId);
  const setCurrentPartId = useStore((state) => state.setCurrentPartId);

  const handleClick = () => {
    setExpanded(!isExpanded);
    setCurrentPartId(partId);
  };

  const isPartSelected = React.useMemo(() => {
    return currentPartId == partId;
  }, [currentPartId, partId]);

  return (
    <React.Fragment>
      <div className="flex flex-col gap-[6px] py-[4px]">
        <div
          className="cursor-pointer w-[282px] rounded-[8px] px-[8px] py-[16px] flex justify-between items-center"
          onClick={handleClick}
          style={{
            background: `${
              isPartSelected
                ? "#565656"
                : "linear-gradient(90deg, #F2F2F2 0%, #FBFBFB 100%)"
            }`,
          }}
        >
          <div className="flex gap-[12px]">
            <LucideIcon
              className={`w-[24px] h-[24px]  ${
                isPartSelected ? "text-[#F8F8F8]" : "text-[#5B5B5B]"
              }`}
            />
            <span
              className={`w-[200px]  tracking-[-0.5px] font-[500] ${
                isPartSelected ? "text-[#E2E2E2]" : "text-[#181818]"
              }`}
            >
              {partName}
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown
              className={`w-[16px] h-[16px] ${
                isPartSelected ? "text-[#F8F8F8]" : ""
              }`}
            />
          ) : (
            <ChevronRight
              className={`w-[16px] h-[16px] ${
                isPartSelected ? "text-[#F8F8F8]" : ""
              }`}
            />
          )}
        </div>
        {isExpanded && chapters?.length > 0 ? (
          <div className="px-[8px] flex flex-col gap-[4px]">
            {chapters?.map((chapter) => (
              <Chapter
                key={chapter.id}
                chapterId={chapter.id}
                chapterName={chapter.chapterName}
                sections={chapter.sections}
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

export default Part;
