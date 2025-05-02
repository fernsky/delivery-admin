import Image from "next/image";
import { motion } from "framer-motion";
import { Building2, MapPin, Users, Mountain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AboutSection = () => {
  const features = [
    {
      icon: <Mountain className="w-5 h-5" />,
      title: "Geographical Location",
      description:
        "Located in Solukhumbu District, covering 124.38 sq. kilometers",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Administrative Center",
      description: "Central operations based in Chaulakharka municipality",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      title: "Formation History",
      description:
        "Established through merger of three major VDCs in the region",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Local Governance",
      description:
        "Structured with 5 administrative wards for effective management",
      color: "from-green-400 to-emerald-500",
    },
  ];

  return (
    <>
      {/* Main section with background image */}
      <section className="relative min-h-[85vh] py-24 overflow-hidden">
        {/* Background Image and overlays */}
        <div className="absolute inset-0">
          <Image
            src="/images/likhu-pike-landscape.jpg"
            alt="Likhu Pike Landscape"
            fill
            className="object-cover object-center brightness-75 contrast-100 saturate-110"
            priority
            quality={90}
          />
          {/* Richer green-black overlays */}
          <div className="absolute inset-0 bg-green-950/20" />
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/20 via-black/10 to-green-950/10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-emerald-900/20 to-black/30 mix-blend-soft-light" />
          <div className="absolute inset-0 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,40,0,0.3)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-green-950/10 to-black/30" />
        </div>

        {/* Content container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 bg-white/10 backdrop-blur-sm border-white/20 text-white/90"
            >
              <Mountain className="w-4 h-4 mr-1" />
              About Us
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight text-white/95 mb-4 drop-shadow-sm">
              About Likhupike
            </h2>
            <p className="text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">
              Discover the beauty and potential of our thriving rural
              municipality
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/10 hover:bg-white/15 transition-all duration-300 shadow-md hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6">
                      <div className="p-3 w-fit rounded-xl bg-white/15 text-white/90">
                        {feature.icon}
                      </div>
                      <div className="pt-2">
                        <h3 className="font-medium text-white/90 mb-3 text-lg">
                          {feature.title}
                        </h3>
                        <p className="text-white/80 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom text section with gradient background */}
      <section className="relative py-24 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-white/80" />
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6"
        >
          <p className="text-gray-600 leading-relaxed tracking-tight">
            Likhu Pike (नेपाली: लिखु पिके गाउँपालिका) is a rural municipality
            established through the merger of former Village Development
            Committees, covering 124.38 square kilometers of diverse terrain.
          </p>
          <p className="text-gray-600 leading-relaxed tracking-tight">
            With a population of 5,534, our municipality represents a vibrant
            community focused on sustainable development and preserving our rich
            cultural heritage.
          </p>
        </motion.div>
      </section>
    </>
  );
};

export default AboutSection;
