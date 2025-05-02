type ItemType = "PARAGRAPH" | "TABLE" | "PIE_CHART" | "STACKED_COLUMN";

interface Item {
  type: ItemType;
}

interface Paragraph extends Item {
  content_ne: string;
  content_en: string;
}

interface Table extends Item {
  data_ne: object[];
  data_en: object[];
  columns_ne: string;
  columns_en: string;
}

interface PieChart extends Item {
  data_ne: Record<string, number | string>[];
  data_en: Record<string, number | string>[];

  configuration_ne: {
    groupKey: string;
    filterKey?: string;
    fillMap: Record<string, string>;
  }[];
  configuration_en: {
    groupKey: string;
    filterKey?: string;
    fillMap: Record<string, string>;
  }[];

  title_ne: string;
  title_en: string;
}

interface StackedColumn extends Item {
  data_ne: Record<string, string | number>[];
  data_en: Record<string, string | number>[];

  title_ne: string;
  title_en: string;

  xAxisKey_ne: string;
  xAxisKey_en: string;

  fillConfiguration_ne: Record<string, string>[];
  fillConfiguration_en: Record<string, string>[];
}

export type ContentSchema = (Paragraph | Table | PieChart | StackedColumn)[];
