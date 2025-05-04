import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Mountain, MapPin, ArrowUpRight, Sparkles } from "lucide-react";

interface HeroProps {
  lng: string;
}

const Hero: React.FC<HeroProps> = ({ lng }) => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Mountain Animation Section */}

      {/* Content Section */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-gray-900 bg-gradient-to-t from-white/70 via-white/50 to-transparent">
        <Badge variant="outline" className="mb-4">
          <Sparkles className="w-4 h-4 mr-1" />
          खजुरा गाउँपालिकामा स्वागत छ
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15]">
          खजुरा गाउँपालिका
        </h1>
        <p className="text-lg leading-relaxed mt-4">
          बाँके जिल्लाको प्राकृतिक सुन्दरता र समृद्ध संस्कृति
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
          <div className="flex items-center gap-2 text-green-600">
            <Mountain className="w-5 h-5" />
            <span className="text-sm font-medium">
              १२४.३८ वर्ग कि.मि. क्षेत्रफल
            </span>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-medium">५ प्रशासनिक वडाहरू</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
          <Link href={`https://digprofile.com/likhupike`}>
            <button className="group px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-[15px] font-medium tracking-wide flex items-center gap-2">
              प्रोफाइल हेर्नुहोस्
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </Link>
          <Link href={`/${lng}/map`}>
            <button className="px-8 py-4 border-2 border-green-600 text-green-700 rounded-xl hover:bg-green-50 transition-all duration-300 text-[15px] font-medium tracking-wide group flex items-center gap-2">
              नक्सा अन्वेषण गर्नुहोस्
              <MapPin className="w-4 h-4 group-hover:animate-bounce" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
