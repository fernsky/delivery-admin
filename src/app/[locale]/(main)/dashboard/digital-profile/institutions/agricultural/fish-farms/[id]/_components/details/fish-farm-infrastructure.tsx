import { Building, Check, X } from "lucide-react";

interface FishFarmInfrastructureProps {
  fishFarm: any;
}

export function FishFarmInfrastructure({
  fishFarm,
}: FishFarmInfrastructureProps) {
  return (
    <div className="space-y-3 pt-6 border-t mt-6">
      <div className="flex items-center gap-2">
        <Building className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">पूर्वाधार र सुविधाहरू</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          {fishFarm.hasFarmHouse ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>फार्म हाउस</span>
        </div>

        <div className="flex items-center gap-2">
          {fishFarm.hasHatchery ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>ह्याचरी</span>
        </div>

        <div className="flex items-center gap-2">
          {fishFarm.hasNursery ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>नर्सरी</span>
        </div>

        <div className="flex items-center gap-2">
          {fishFarm.hasFeedStorage ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>दाना भण्डार</span>
        </div>

        <div className="flex items-center gap-2">
          {fishFarm.hasEquipment ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>उपकरण</span>
        </div>

        <div className="flex items-center gap-2">
          {fishFarm.hasLaboratory ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>प्रयोगशाला</span>
        </div>

        <div className="flex items-center gap-2">
          {fishFarm.hasIceProduction ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>बरफ उत्पादन</span>
        </div>

        <div className="flex items-center gap-2">
          {fishFarm.hasProcessingArea ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>प्रशोधन क्षेत्र</span>
        </div>

        <div className="flex items-center gap-2">
          {fishFarm.hasElectricity ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>विद्युत</span>
        </div>

        <div className="flex items-center gap-2">
          {fishFarm.hasGenerator ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>जेनेरेटर</span>
        </div>

        <div className="flex items-center gap-2">
          {fishFarm.hasFencing ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>बार</span>
        </div>

        <div className="flex items-center gap-2">
          {fishFarm.hasSecuritySystem ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>सुरक्षा प्रणाली</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {fishFarm.hasHatchery && fishFarm.hatcheryCapacity && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">
              ह्याचरी क्षमता
            </h3>
            <p>{fishFarm.hatcheryCapacity} इकाई</p>
          </div>
        )}

        {fishFarm.hasNursery && fishFarm.nurseryAreaInSquareMeters && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">
              नर्सरी क्षेत्रफल
            </h3>
            <p>{fishFarm.nurseryAreaInSquareMeters} वर्ग मिटर</p>
          </div>
        )}
      </div>

      {fishFarm.hasEquipment && fishFarm.equipmentDetails && (
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">
            उपकरण विवरण
          </h3>
          <p>{fishFarm.equipmentDetails}</p>
        </div>
      )}

      {fishFarm.hasLaboratory && fishFarm.laboratoryPurpose && (
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">
            प्रयोगशाला प्रयोजन
          </h3>
          <p>{fishFarm.laboratoryPurpose}</p>
        </div>
      )}
    </div>
  );
}
