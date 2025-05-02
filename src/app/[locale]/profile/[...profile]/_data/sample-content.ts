import { ContentSchema } from "./types";

export const sampleContent: ContentSchema = [
  {
    type: "PARAGRAPH",
    content_en: "Likhupike.",
    content_ne: "",
  },
  {
    type: "TABLE",
    data_en: [
      { category: "Agriculture", value: "60%", area: "1000 ha" },
      { category: "Forest", value: "30%", area: "500 ha" },
      { category: "Settlement", value: "10%", area: "100 ha" },
    ],
    data_ne: [
      { category: "कृषि", value: "६०%", area: "१००० हे" },
      { category: "वन", value: "३०%", area: "५०० हे" },
      { category: "बस्ती", value: "१०%", area: "१०० हे" },
    ],
    columns_en: JSON.stringify([
      { key: "category", header: "Category" },
      { key: "value", header: "Percentage", align: "right" },
      { key: "area", header: "Area", align: "right" },
    ]),
    columns_ne: JSON.stringify([
      { key: "category", header: "वर्ग" },
      { key: "value", header: "प्रतिशत", align: "right" },
      { key: "area", header: "क्षेत्रफल", align: "right" },
    ]),
  },
  {
    type: "PIE_CHART",
    data_en: [
      { name: "Ward 1", agriculture: 30, forest: 40, settlement: 30 },
      { name: "Ward 2", agriculture: 45, forest: 35, settlement: 20 },
    ],
    data_ne: [
      { name: "वडा १", agriculture: 30, forest: 40, settlement: 30 },
      { name: "वडा २", agriculture: 45, forest: 35, settlement: 20 },
    ],
    configuration_en: [{
      groupKey: "name",
      filterKey: "name",
      fillMap: {
        agriculture: "#962DFF",
        forest: "#C893FD",
        settlement: "#E0C6FD",
      },
    }],
    configuration_ne: [{
      groupKey: "name",
      filterKey: "name",
      fillMap: {
        agriculture: "#962DFF",
        forest: "#C893FD",
        settlement: "#E0C6FD",
      },
    }],
    title_en: "Land Use Distribution",
    title_ne: "भूमि प्रयोग वितरण",
  },
];
