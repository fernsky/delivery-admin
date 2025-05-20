"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Mountain,
  MapPin,
  ArrowUpRight,
  Sparkles,
  Users,
  Home,
} from "lucide-react";
import Head from "next/head";
import { localizeNumber } from "@/lib/utils/localize-number";
import TeraiLandscape from "./terai-landscape";

interface HeroProps {
  lng: string;
  municipalityName: string;
  municipalityNameEn: string;
  demographicData?: {
    totalPopulation?: number | null;
    totalHouseholds?: number | null;
    areaSqKm?: string | null;
    populationDensity?: string | null;
    id?: string;
  } | null;
}

const Hero: React.FC<HeroProps> = ({
  lng,
  municipalityName,
  municipalityNameEn,
  demographicData,
}) => {
  // Extract data with proper fallbacks
  const totalArea = demographicData?.areaSqKm
    ? parseFloat(demographicData.areaSqKm)
    : 124.38;

  // Get ward count data for Khajura Rural Municipality
  const wardCount = 8;

  // Calculate stats to display
  const population = demographicData?.totalPopulation || 35055;
  const households = demographicData?.totalHouseholds || 7562;

  // SEO description with actual data
  const seoDescription = `${municipalityName} (${municipalityNameEn}) - ${localizeNumber(totalArea.toString(), "ne")} वर्ग कि.मि. क्षेत्रफल, ${localizeNumber(wardCount.toString(), "ne")} प्रशासनिक वडाहरू, ${localizeNumber(population.toString(), "ne")} जनसंख्या। बाँके जिल्लाको प्राकृतिक सुन्दरता र समृद्ध संस्कृति। सम्पूर्ण जानकारी र नक्सा यहाँ उपलब्ध छ।`;

  return (
    <>
      {/* SEO Structured Data */}
      <Head>
        <meta name="description" content={seoDescription} />
        <meta
          property="og:title"
          content={`${municipalityName} | आधिकारिक वेबसाइट`}
        />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "GovernmentOrganization",
            name: municipalityName,
            alternateName: municipalityNameEn,
            url: `https://${lng === "en" ? "en." : ""}khajura-rm.gov.np`,
            logo: "https://khajura-rm.gov.np/logo.png",
            areaServed: {
              "@type": "AdministrativeArea",
              name: "Khajura",
              containedIn: "Banke District, Nepal",
              description: seoDescription,
              additionalProperty: [
                {
                  "@type": "PropertyValue",
                  name: "population",
                  value: population,
                },
                {
                  "@type": "PropertyValue",
                  name: "numberOfWards",
                  value: wardCount,
                },
                {
                  "@type": "PropertyValue",
                  name: "totalArea",
                  value: totalArea,
                  unitCode: "KMQ",
                },
              ],
            },
          })}
        </script>
      </Head>

      {/* Background Container with Landscape */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Three.js Terai Landscape Component with reduced opacity */}
        <TeraiLandscape opacity={0.9} />

        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 z-5 bg-gradient-to-b from-white/20 to-white/60 backdrop-blur-[2px]"></div>

        {/* Content Section */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
          {/* Hero Content Container with glass effect */}
          <div className="w-full max-w-4xl mx-auto rounded-2xl backdrop-blur-sm p-8 ">
            {/* Municipality English Name */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-2 text-center text-emerald-950"
              itemProp="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {municipalityName}
            </motion.h1>

            {/* Location - District and Province */}
            <motion.p
              className="text-base sm:text-lg leading-relaxed mb-6 text-gray-800 max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              बाँके जिल्ला, लुम्बिनी प्रदेश
            </motion.p>

            {/* Key Metrics Cards */}
            <motion.div
              className="flex flex-wrap gap-4 items-center justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Area Card */}
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-emerald-700 border border-green-100 border-l-4 border-l-emerald-500">
                <Mountain className="w-4 h-4" />
                <span
                  className="text-sm font-medium"
                  itemProp="areaServed"
                  itemScope
                  itemType="https://schema.org/AdministrativeArea"
                >
                  <span itemProp="size">
                    {localizeNumber(totalArea.toString(), "ne")}
                  </span>{" "}
                  वर्ग कि.मि.
                </span>
              </div>

              {/* Ward Count Card */}
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-emerald-700 border border-green-100 border-l-4 border-l-emerald-500">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {localizeNumber(wardCount.toString(), "ne")} वडा
                </span>
              </div>

              {/* Population Card */}
              {demographicData?.totalPopulation && (
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-emerald-700 border border-green-100 border-l-4 border-l-emerald-500">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {localizeNumber(
                      demographicData.totalPopulation.toString(),
                      "ne",
                    )}{" "}
                    जनसंख्या
                  </span>
                </div>
              )}

              {/* Households Card */}
              {demographicData?.totalHouseholds && (
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-emerald-700 border border-green-100 border-l-4 border-l-emerald-500">
                  <Home className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {localizeNumber(
                      demographicData.totalHouseholds.toString(),
                      "ne",
                    )}{" "}
                    घरधुरी
                  </span>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Profile Button */}
              <Link href={`/profile`}>
                <motion.button
                  className="group px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg flex items-center gap-2 relative overflow-hidden"
                  whileHover={{
                    scale: 1.03,
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10"></span>
                  <span className="relative">प्रोफाइल हेर्नुहोस्</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative" />
                </motion.button>
              </Link>

              {/* Map Button */}
              <Link href={`/profile`}>
                <motion.button
                  className="px-8 py-4 border-2 border-green-600 text-green-700 rounded-xl transition-all flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white/100"
                  whileHover={{ backgroundColor: "rgba(240, 253, 244, 0.8)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  नक्सा हेर्नुहोस्
                  <MapPin className="w-4 h-4 group-hover:animate-bounce" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
