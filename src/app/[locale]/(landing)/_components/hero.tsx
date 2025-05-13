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

      {/* Mountain Animation Section */}
      <div className="absolute inset-0 z-0">
        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-100" />

        {/* Sun */}
        <motion.div
          className="absolute top-20 right-20 w-24 h-24 rounded-full bg-yellow-200"
          animate={{
            boxShadow: [
              "0 0 40px 20px rgba(252, 211, 77, 0.3)",
              "0 0 60px 30px rgba(252, 211, 77, 0.4)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Mountains in background */}
        <div className="absolute bottom-0 w-full">
          <svg
            viewBox="0 0 1440 320"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#4b7e3d"
              fillOpacity="0.6"
              d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,197.3C840,192,960,160,1080,160C1200,160,1320,192,1380,208L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            />
          </svg>
        </div>

        {/* Fields in foreground */}
        <div className="absolute bottom-0 w-full">
          <svg
            viewBox="0 0 1440 320"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#65a30d"
              fillOpacity="0.8"
              d="M0,288L48,272C96,256,192,224,288,229.3C384,235,480,277,576,272C672,267,768,213,864,197.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        {/* Animated birds */}
        <motion.div
          className="absolute top-40 left-1/4"
          animate={{
            x: [0, 100, 200, 300, 400],
            y: [0, -20, -10, -30, -5],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <svg width="40" height="20" viewBox="0 0 40 20">
            <path
              d="M0,10 C10,0 10,20 20,10 C30,0 30,20 40,10"
              stroke="black"
              fill="transparent"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      </div>

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
          <Link href={`https://digprofile.com/khajura`}>
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
