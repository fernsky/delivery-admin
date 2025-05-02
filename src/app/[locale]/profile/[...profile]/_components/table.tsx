import {
  Table as BaseTable,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableDemoProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
    width?: string;
    align?: "left" | "right";
  }[];
  footer?: {
    label: string;
    value: string;
  };
}

export function Table<T>({ data, columns, footer }: TableDemoProps<T>) {
  return (
    <BaseTable className="rounded-md">
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={String(column.key)}
              className={`${column.width ? `w-[${column.width}]` : ""} ${
                column.align === "right" ? "text-right" : ""
              }`}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell
                key={String(column.key)}
                className={column.align === "right" ? "text-right" : ""}
              >
                {String(item[column.key])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      {footer && (
        <TableFooter className="rounded-b-md">
          <TableRow>
            <TableCell colSpan={columns.length - 1}>{footer.label}</TableCell>
            <TableCell className="text-right">{footer.value}</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </BaseTable>
  );
}
