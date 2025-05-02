import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { MapPinned, Users, Home, Trees, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Statistics = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const stats = [
    {
      label: "Total Area",
      value: 124.38,
      suffix: "km²",
      icon: <MapPinned className="w-5 h-5" />,
      description: "Total land coverage",
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Population",
      value: 5534,
      suffix: "+",
      icon: <Users className="w-5 h-5" />,
      description: "Resident count",
      color: "from-emerald-500 to-green-600",
    },
    {
      label: "Wards",
      value: 5,
      suffix: "",
      icon: <Home className="w-5 h-5" />,
      description: "Administrative divisions",
      color: "from-green-400 to-emerald-500",
    },
    {
      label: "Villages",
      value: 3,
      suffix: "",
      icon: <Trees className="w-5 h-5" />,
      description: "Rural communities",
      color: "from-emerald-400 to-green-500",
    },
  ];

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-white/80" />
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16 space-y-4"
        >
          <Badge variant="outline" className="mb-4">
            <TrendingUp className="w-4 h-4 mr-1" />
            Municipality Overview
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Key Statistics
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Essential figures and data that define our local governance and
            community development
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="relative h-full">
                  {/* Gradient background */}
                  <div
                    className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-15 transition-opacity`}
                  />

                  <CardContent className="relative p-6">
                    <div className="flex flex-col gap-6">
                      <div
                        className={`p-3 w-fit rounded-xl bg-gradient-to-br ${stat.color} text-white group-hover:scale-105 transition-transform`}
                      >
                        {stat.icon}
                      </div>

                      <div className="pt-2">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.label}
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-gray-900">
                            {inView && (
                              <CountUp
                                end={stat.value}
                                duration={2}
                                decimals={stat.label === "Total Area" ? 2 : 0}
                              />
                            )}
                          </span>
                          <span className="text-lg font-medium text-green-600">
                            {stat.suffix}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
