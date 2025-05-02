import React from "react";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  MapPin,
  ArrowUpRight,
  GridIcon,
  TrendingUp,
  GraduationCap,
  Baby,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
}) => (
  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white group-hover:scale-105 transition-transform">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    {trend && (
      <div className="mt-2 flex items-center gap-1">
        <TrendingUp className="w-4 h-4 text-green-600" />
        <span className="text-sm text-green-700">{trend}</span>
      </div>
    )}
  </div>
);

const WardInfo = () => {
  const wards = [
    {
      number: 1,
      households: 152,
      population: 558,
      area: 35.9,
      density: 15.54,
      avgFamilySize: 4,
      genderRatio: 119.69,
      growthRate: -2.46,
      description: "उत्तरी क्षेत्रमा विशाल पहाडी भूभाग",
      color: "from-green-500 to-emerald-600",
      indicators: {
        households: "१८% कृषि",
        education: "७५% साक्षरता दर",
        health: "१ स्वास्थ्य चौकी",
        infrastructure: "१२ किमी सडक नेटवर्क",
      },
    },
    {
      number: 2,
      households: 388,
      population: 1645,
      area: 27.62,
      density: 59.56,
      avgFamilySize: 4,
      genderRatio: 109.55,
      growthRate: 1.23,
      description: "केन्द्रीय कृषि क्षेत्र उर्वर भूमि सहित",
      color: "from-emerald-500 to-green-600",
      indicators: {
        households: "२५% कृषि",
        education: "८०% साक्षरता दर",
        health: "२ स्वास्थ्य चौकी",
        infrastructure: "२० किमी सडक नेटवर्क",
      },
    },
    {
      number: 3,
      households: 233,
      population: 1197,
      area: 10.03,
      density: 119.34,
      avgFamilySize: 5,
      genderRatio: 97.69,
      growthRate: 0.56,
      description: "मिश्रित विकास सहित बाक्लो बस्ती",
      color: "from-green-400 to-emerald-500",
      indicators: {
        households: "३०% कृषि",
        education: "८५% साक्षरता दर",
        health: "३ स्वास्थ्य चौकी",
        infrastructure: "१५ किमी सडक नेटवर्क",
      },
    },
    {
      number: 4,
      households: 246,
      population: 1334,
      area: 5.53,
      density: 241.23,
      avgFamilySize: 5,
      genderRatio: 113.78,
      growthRate: 2.34,
      description: "उच्च जनसंख्या घनत्व सहित शहरी केन्द्र",
      color: "from-emerald-400 to-green-500",
      indicators: {
        households: "३५% कृषि",
        education: "९०% साक्षरता दर",
        health: "४ स्वास्थ्य चौकी",
        infrastructure: "२५ किमी सडक नेटवर्क",
      },
    },
    {
      number: 5,
      households: 249,
      population: 1117,
      area: 45.31,
      density: 24.65,
      avgFamilySize: 4,
      genderRatio: 104.21,
      growthRate: -1.12,
      description: "विविध भू-दृश्य सहित दक्षिणी क्षेत्र",
      color: "from-green-500 to-emerald-500",
      indicators: {
        households: "४०% कृषि",
        education: "७०% साक्षरता दर",
        health: "५ स्वास्थ्य चौकी",
        infrastructure: "३० किमी सडक नेटवर्क",
      },
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-white/80" />
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <MapPin className="w-4 ह-4 mr-1" />
            प्रशासनिक विभाजन
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            वडा जानकारी
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            प्रत्येक वडाको विस्तृत जनसांख्यिकीय र विकास सूचकहरू अन्वेषण
            गर्नुहोस्
          </p>
        </div>

        {/* Enhanced Grid Layout with Center Alignment */}
        <div className="flex flex-col items-center">
          {/* First Row - 2 Wards */}
          <div className="grid lg:grid-cols-2 gap-8 w-full max-w-5xl">
            {wards.slice(0, 2).map((ward, index) => (
              <motion.div
                key={ward.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative h-full">
                    {/* Gradient background */}
                    <div
                      className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${ward.color} opacity-10 group-hover:opacity-15 transition-opacity`}
                    />

                    <CardContent className="relative p-6">
                      <div className="flex flex-col gap-6">
                        {/* Enhanced Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-3 w-fit rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white group-hover:scale-105 transition-transform`}
                            >
                              <Home className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                वडा {ward.number}
                              </h3>
                              <p className="text-sm text-gray-500">
                                क्षेत्रफल: {ward.area} वर्ग कि.मि.
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="font-medium">
                            क्षेत्र {ward.number}
                          </Badge>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <StatCard
                            label="जनसंख्या"
                            value={ward.population}
                            icon={Users}
                            trend={`${ward.growthRate}% वृद्धि`}
                          />
                          <StatCard
                            label="घरपरिवार"
                            value={ward.households}
                            icon={Home}
                            trend={`${ward.avgFamilySize} औसत आकार`}
                          />
                        </div>

                        {/* Indicators Grid */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900">
                            प्रमुख सूचकहरू
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(ward.indicators).map(
                              ([key, value]) => {
                                let nepaliKey = "";
                                switch (key) {
                                  case "households":
                                    nepaliKey = "घरधुरी";
                                    break;
                                  case "education":
                                    nepaliKey = "शिक्षा";
                                    break;
                                  case "health":
                                    nepaliKey = "स्वास्थ्य";
                                    break;
                                  case "infrastructure":
                                    nepaliKey = "पूर्वाधार";
                                    break;
                                  default:
                                    nepaliKey = key;
                                }
                                return (
                                  <div
                                    key={key}
                                    className="bg-gray-50/50 rounded-lg p-3 hover:bg-gray-50/80 transition-colors"
                                  >
                                    <p className="text-sm text-gray-500 mb-1">
                                      {nepaliKey}
                                    </p>
                                    <p className="font-medium text-gray-900">
                                      {value}
                                    </p>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 mt-2 border-t">
                          <div className="flex items-center gap-2">
                            <GridIcon className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-600">
                              घनत्व: {ward.density}/वर्ग कि.मि.
                            </span>
                          </div>
                          <button className="text-sm font-medium text-green-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                            विवरण हेर्नुहोस्
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Middle Row - 2 Wards */}
          <div className="grid lg:grid-cols-2 gap-8 w-full max-w-5xl mt-8">
            {wards.slice(2, 4).map((ward, index) => (
              <motion.div
                key={ward.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index + 2) * 0.1 }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative h-full">
                    {/* Gradient background */}
                    <div
                      className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${ward.color} opacity-10 group-hover:opacity-15 transition-opacity`}
                    />

                    <CardContent className="relative p-6">
                      <div className="flex flex-col gap-6">
                        {/* Enhanced Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-3 w-fit rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white group-hover:scale-105 transition-transform`}
                            >
                              <Home className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                वडा {ward.number}
                              </h3>
                              <p className="text-sm text-gray-500">
                                क्षेत्रफल: {ward.area} वर्ग कि.मि.
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="font-medium">
                            क्षेत्र {ward.number}
                          </Badge>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <StatCard
                            label="जनसंख्या"
                            value={ward.population}
                            icon={Users}
                            trend={`${ward.growthRate}% वृद्धि`}
                          />
                          <StatCard
                            label="घरपरिवार"
                            value={ward.households}
                            icon={Home}
                            trend={`${ward.avgFamilySize} औसत आकार`}
                          />
                        </div>

                        {/* Indicators Grid */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900">
                            प्रमुख सूचकहरू
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(ward.indicators).map(
                              ([key, value]) => {
                                let nepaliKey = "";
                                switch (key) {
                                  case "households":
                                    nepaliKey = "घरधुरी";
                                    break;
                                  case "education":
                                    nepaliKey = "शिक्षा";
                                    break;
                                  case "health":
                                    nepaliKey = "स्वास्थ्य";
                                    break;
                                  case "infrastructure":
                                    nepaliKey = "पूर्वाधार";
                                    break;
                                  default:
                                    nepaliKey = key;
                                }
                                return (
                                  <div
                                    key={key}
                                    className="bg-gray-50/50 rounded-lg p-3 hover:bg-gray-50/80 transition-colors"
                                  >
                                    <p className="text-sm text-gray-500 mb-1">
                                      {nepaliKey}
                                    </p>
                                    <p className="font-medium text-gray-900">
                                      {value}
                                    </p>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 mt-2 border-t">
                          <div className="flex items-center gap-2">
                            <GridIcon className="w-4 ह-4 text-green-600" />
                            <span className="text-sm text-gray-600">
                              घनत्व: {ward.density}/वर्ग कि.मि.
                            </span>
                          </div>
                          <button className="text-sm font-medium text-green-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                            विवरण हेर्नुहोस्
                            <ArrowUpRight className="w-4 ह-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Last Row - Single Ward Centered */}
          <div className="w-full max-w-5xl mt-8 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="group w-full lg:w-1/2"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-full">
                  {/* Gradient background */}
                  <div
                    className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${wards[4].color} opacity-10 group-hover:opacity-15 transition-opacity`}
                  />

                  <CardContent className="relative p-6">
                    <div className="flex flex-col gap-6">
                      {/* Enhanced Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 w-fit rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white group-hover:scale-105 transition-transform`}
                          >
                            <Home className="w-5 ह-5" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              वडा {wards[4].number}
                            </h3>
                            <p className="text-sm text-gray-500">
                              क्षेत्रफल: {wards[4].area} वर्ग कि.मि.
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="font-medium">
                          क्षेत्र {wards[4].number}
                        </Badge>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <StatCard
                          label="जनसंख्या"
                          value={wards[4].population}
                          icon={Users}
                          trend={`${wards[4].growthRate}% वृद्धि`}
                        />
                        <StatCard
                          label="घरपरिवार"
                          value={wards[4].households}
                          icon={Home}
                          trend={`${wards[4].avgFamilySize} औसत आकार`}
                        />
                      </div>

                      {/* Indicators Grid */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">
                          प्रमुख सूचकहरू
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(wards[4].indicators).map(
                            ([key, value]) => {
                              let nepaliKey = "";
                              switch (key) {
                                case "households":
                                  nepaliKey = "घरधुरी";
                                  break;
                                case "education":
                                  nepaliKey = "शिक्षा";
                                  break;
                                case "health":
                                  nepaliKey = "स्वास्थ्य";
                                  break;
                                case "infrastructure":
                                  nepaliKey = "पूर्वाधार";
                                  break;
                                default:
                                  nepaliKey = key;
                              }
                              return (
                                <div
                                  key={key}
                                  className="bg-gray-50/50 rounded-lg p-3 hover:bg-gray-50/80 transition-colors"
                                >
                                  <p className="text-sm text-gray-500 mb-1">
                                    {nepaliKey}
                                  </p>
                                  <p className="font-medium text-gray-900">
                                    {value}
                                  </p>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 mt-2 border-t">
                        <div className="flex items-center gap-2">
                          <GridIcon className="w-4 ह-4 text-green-600" />
                          <span className="text-sm text-gray-600">
                            घनत्व: {wards[4].density}/वर्ग कि.मि.
                          </span>
                        </div>
                        <button className="text-sm font-medium text-green-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                          विवरण हेर्नुहोस्
                          <ArrowUpRight className="w-4 ह-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WardInfo;
