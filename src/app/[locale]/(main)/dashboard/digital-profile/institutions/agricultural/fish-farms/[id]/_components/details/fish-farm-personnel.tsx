import { Users, Check, X } from "lucide-react";

interface FishFarmPersonnelProps {
  fishFarm: any;
}

export function FishFarmPersonnel({ fishFarm }: FishFarmPersonnelProps) {
  return (
    <div className="space-y-3 pt-6 border-t mt-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">व्यक्ति र व्यवस्थापन</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fishFarm.ownerName && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              मालिकको नाम
            </h3>
            <p>{fishFarm.ownerName}</p>
          </div>
        )}

        {fishFarm.ownerContact && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              मालिकको सम्पर्क
            </h3>
            <p>{fishFarm.ownerContact}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fishFarm.managerName && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              प्रबन्धकको नाम
            </h3>
            <p>{fishFarm.managerName}</p>
          </div>
        )}

        {fishFarm.managerContact && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              प्रबन्धकको सम्पर्क
            </h3>
            <p>{fishFarm.managerContact}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fishFarm.technicalStaffCount !== null &&
          fishFarm.technicalStaffCount !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                प्राविधिक कर्मचारी संख्या
              </h3>
              <p>{fishFarm.technicalStaffCount} जना</p>
            </div>
          )}

        {fishFarm.regularStaffCount !== null &&
          fishFarm.regularStaffCount !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                नियमित कर्मचारी संख्या
              </h3>
              <p>{fishFarm.regularStaffCount} जना</p>
            </div>
          )}

        {fishFarm.seasonalLaborCount !== null &&
          fishFarm.seasonalLaborCount !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                मौसमी कामदार संख्या
              </h3>
              <p>{fishFarm.seasonalLaborCount} जना</p>
            </div>
          )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {fishFarm.hasTrainedStaff ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <h3 className="text-sm font-medium">प्रशिक्षित कर्मचारी</h3>
        </div>
        {fishFarm.hasTrainedStaff && fishFarm.trainingDetails && (
          <p className="ml-6 text-sm">{fishFarm.trainingDetails}</p>
        )}
      </div>
    </div>
  );
}
