import { Leaf, Check, X } from "lucide-react";

interface FishFarmSustainabilityProps {
  fishFarm: any;
}

export function FishFarmSustainability({
  fishFarm,
}: FishFarmSustainabilityProps) {
  return (
    <div className="space-y-3 pt-6 border-t mt-6">
      <div className="flex items-center gap-2">
        <Leaf className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">दिगोपन र वातावरणीय पक्षहरू</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          {fishFarm.hasEnvironmentalImpactAssessment ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>वातावरणीय प्रभाव मूल्यांकन</span>
        </div>

        <div className="flex items-center gap-2">
          {fishFarm.usesRenewableEnergy ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>नवीकरणीय ऊर्जा प्रयोग</span>
        </div>

        <div className="flex items-center gap-2">
          {fishFarm.hasCertifications ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <span>प्रमाणीकरण</span>
        </div>
      </div>

      {fishFarm.usesRenewableEnergy && fishFarm.renewableEnergyDetails && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            नवीकरणीय ऊर्जा विवरण
          </h3>
          <p>{fishFarm.renewableEnergyDetails}</p>
        </div>
      )}

      {fishFarm.wasteManagementPractices && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            फोहोर व्यवस्थापन अभ्यासहरू
          </h3>
          <p>{fishFarm.wasteManagementPractices}</p>
        </div>
      )}

      {fishFarm.hasCertifications && fishFarm.certificationDetails && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            प्रमाणीकरण विवरण
          </h3>
          <p>{fishFarm.certificationDetails}</p>
        </div>
      )}

      {/* Challenges and support */}
      <div className="space-y-3 pt-4 border-t mt-4">
        <h3 className="text-base font-medium">चुनौती र सहायता</h3>

        {fishFarm.majorConstraints && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              प्रमुख चुनौतीहरू
            </h3>
            <p>{fishFarm.majorConstraints}</p>
          </div>
        )}

        {fishFarm.disasterVulnerabilities && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              प्रकोप संवेदनशीलता
            </h3>
            <p>{fishFarm.disasterVulnerabilities}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {fishFarm.receivesGovernmentSupport ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-gray-400" />
              )}
              <h3 className="text-sm font-medium">सरकारी सहयोग प्राप्त</h3>
            </div>
            {fishFarm.receivesGovernmentSupport &&
              fishFarm.governmentSupportDetails && (
                <p className="ml-6 text-sm">
                  {fishFarm.governmentSupportDetails}
                </p>
              )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {fishFarm.receivesNGOSupport ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-gray-400" />
              )}
              <h3 className="text-sm font-medium">गैसस सहयोग प्राप्त</h3>
            </div>
            {fishFarm.receivesNGOSupport && fishFarm.ngoSupportDetails && (
              <p className="ml-6 text-sm">{fishFarm.ngoSupportDetails}</p>
            )}
          </div>
        </div>

        {fishFarm.technicalSupportNeeds && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              प्राविधिक सहायता आवश्यकताहरू
            </h3>
            <p>{fishFarm.technicalSupportNeeds}</p>
          </div>
        )}
      </div>

      {/* Future Plans */}
      <div className="space-y-3 pt-4 border-t mt-4">
        <h3 className="text-base font-medium">भविष्य योजनाहरू</h3>

        {fishFarm.expansionPlans && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              विस्तार योजनाहरू
            </h3>
            <p>{fishFarm.expansionPlans}</p>
          </div>
        )}

        {fishFarm.diversificationPlans && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              विविधीकरण योजनाहरू
            </h3>
            <p>{fishFarm.diversificationPlans}</p>
          </div>
        )}

        {fishFarm.technologyUpgradePlans && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              प्रविधि अपग्रेड योजनाहरू
            </h3>
            <p>{fishFarm.technologyUpgradePlans}</p>
          </div>
        )}
      </div>
    </div>
  );
}
