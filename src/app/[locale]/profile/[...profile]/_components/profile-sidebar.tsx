import React from "react";
import Part, { PartIcon } from "./part";
import useStore from "../../_store/app-store";

export interface SectionLabel {
  id: string;
  sectionName: string;
}

export interface ChapterLabel {
  id: string;
  chapterName: string;
  sections: SectionLabel[];
}

export interface PartLabel {
  id: string;
  partName: string;
  iconName: PartIcon;
  chapters: ChapterLabel[];
}

const data: PartLabel[] = [
  {
    id: "introduction",
    partName: "Introduction",
    iconName: "Info",
    chapters: [
      {
        id: "cultural-heritage",
        chapterName: "Cultural Heritage",
        sections: [
          {
            id: "traditional-dances",
            sectionName: "Traditional Dances",
          },
          {
            id: "festivals",
            sectionName: "Festivals",
          },
          {
            id: "local-cuisine",
            sectionName: "Local Cuisine",
          },
          {
            id: "handicrafts",
            sectionName: "Handicrafts",
          },
          {
            id: "folklore",
            sectionName: "Folklore",
          },
          {
            id: "music",
            sectionName: "Music",
          },
          {
            id: "art",
            sectionName: "Art",
          },
          {
            id: "architecture",
            sectionName: "Architecture",
          },
          {
            id: "clothing",
            sectionName: "Clothing",
          },
          {
            id: "language",
            sectionName: "Language",
          },
        ],
      },
      {
        id: "historical-background",
        chapterName: "Historical Background and Naming",
        sections: [
          {
            id: "age-wise-training",
            sectionName: "Age wise training",
          },
          {
            id: "major-settlement-areas",
            sectionName: "Major Settlement Areas",
          },
          {
            id: "religious-description",
            sectionName: "Religious Description of Demography",
          },
        ],
      },
    ],
  },
  {
    id: "economy",
    partName: "Economy",
    iconName: "CircleDollarSign",
    chapters: [],
  },
  {
    id: "social-description",
    partName: "Social Description",
    iconName: "Users",
    chapters: [],
  },
  {
    id: "demography",
    partName: "Demography",
    iconName: "PersonStanding",
    chapters: [],
  },
  {
    id: "forest-environment",
    partName: "Forest & Environment",
    iconName: "TreePine",
    chapters: [],
  },
  {
    id: "infrastructure",
    partName: "Infrastructure",
    iconName: "Building",
    chapters: [],
  },
  {
    id: "good-governance",
    partName: "Good Governance",
    iconName: "Landmark",
    chapters: [],
  },
];
console.log(data);

const Sidebar: React.FC = ({}) => {
  return (
    <React.Fragment>
      <div className="flex flex-col ">
        {data.map((part) => (
          <Part
            partName={part.partName}
            partId={part.id}
            key={part.id}
            iconName={part.iconName}
            chapters={part.chapters}
          />
        ))}
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
