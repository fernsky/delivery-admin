import { FileText } from "lucide-react";
import { Card } from "../../building/card";
import { DetailRow } from "../../shared/detail-row";
import { Business } from "@/server/db/schema";
import { MultipleDetailRow } from "@/components/shared/multiple-detail-row";

export function LegalInfoSection({ business }: { business: Business }) {
  return (
    <Card title="Legal Information" icon={FileText}>
      <DetailRow
        icon={FileText}
        label="Registration Status"
        value={business?.registeredBodies?.length ? "Registered" : "Not Registered"}
      />
      <MultipleDetailRow
        icon={FileText}
        label="Registered Bodies"
        values={business?.registeredBodies}
      />
      
      <DetailRow
        icon={FileText}
        label="Statutory Status"
        value={business?.statutoryStatus}
      />
      {business?.statutoryStatusOther && (
        <DetailRow
          icon={FileText}
          label="Other Statutory Status"
          value={business.statutoryStatusOther}
        />
      )}
     
      {business?.panNumber && (
        <DetailRow
          icon={FileText}
          label="PAN Number"
          value={business.panNumber}
        />
      )}
    </Card>
  );
}
