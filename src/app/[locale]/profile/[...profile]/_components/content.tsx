import { ContentSchema } from "../_data/types";
import Paragraph from "./paragraph";
import { Table } from "./table";
import PieChart from "@/components/charts/pie-chart/pie-chart";
import StackedColumn from "@/components/charts/stacked-column/stacked-column";

interface ContentProps {
  lng: string;
  content: ContentSchema;
}

interface PieChartConfiguration {
  groupKey: string;
  filterKey?: string;
  fillMap: Record<string, string>;
}

const Content: React.FC<ContentProps> = ({ lng, content }) => {
  const renderContent = (item: ContentSchema[number], index: number) => {
    const langSuffix = lng === "ne" ? "_ne" : "_en";

    switch (item.type) {
      case "PARAGRAPH":
        return (
          <Paragraph key={index}>
            {item[`content${langSuffix}` as keyof typeof item] as string}
          </Paragraph>
        );
      case "TABLE":
        const tableItem = item as Extract<
          ContentSchema[number],
          { type: "TABLE" }
        >;
        const columns = JSON.parse(tableItem[`columns${langSuffix}`]);
        return (
          <Table
            key={index}
            data={tableItem[`data${langSuffix}`]}
            columns={columns}
          />
        );
      case "PIE_CHART":
        const pieItem = item as Extract<
          ContentSchema[number],
          { type: "PIE_CHART" }
        >;
        const configKey = `configuration${langSuffix}` as keyof typeof pieItem;
        const dataKey = `data${langSuffix}` as keyof typeof pieItem;
        const titleKey = `title${langSuffix}` as keyof typeof pieItem;

        const pieConfig = (pieItem[configKey] as PieChartConfiguration[])[0];
        const pieData = pieItem[dataKey] as Array<
          Record<string, string | number>
        >;

        return (
          <PieChart
            key={index}
            data={pieData}
            groupKey={pieConfig.groupKey}
            fillMap={pieConfig.fillMap}
            title={pieItem[titleKey] as string}
            filterKey={pieConfig.filterKey}
          />
        );
      case "STACKED_COLUMN":
        const columnItem = item as Extract<
          ContentSchema[number],
          { type: "STACKED_COLUMN" }
        >;
        return (
          <StackedColumn
            key={index}
            data={columnItem[`data${langSuffix}`]}
            xAxisKey={columnItem[`xAxisKey${langSuffix}`]}
            fillMap={columnItem[`fillConfiguration${langSuffix}`][0]}
            title={columnItem[`title${langSuffix}`]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-[16px]">
      {content.map((item, index) => renderContent(item, index))}
    </div>
  );
};

export default Content;
