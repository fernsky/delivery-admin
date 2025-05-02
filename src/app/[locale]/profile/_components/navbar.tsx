"use client";
import React, { useState, useEffect } from "react";
import ChangeLanguage from "./change-language";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Map,
  Download,
  User,
  MapPin,
  Sparkles,
  Mountain,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  lng: string;
}

const Navbar: React.FC<NavbarProps> = ({ lng }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      href: `/profile/map`,
      label: "नक्सा",
      icon: Map,
      color: "from-emerald-500 to-green-600",
      description: "इन्टर्याक्टिभ नक्सा हेर्नुहोस्",
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
    >
      <div
        className={`bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo */}
            <Link href={`/profile`} className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white group-hover:shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                <Mountain className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-bold tracking-tight group-hover:text-green-600 transition-colors">
                  खजुरा
                </span>
                <Badge
                  variant="outline"
                  className="hidden sm:flex items-center gap-1 mt-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span className="text-[10px]">गाउँपालिका</span>
                </Badge>
              </div>
            </Link>

            {/* Simplified Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex items-center gap-3 px-3 py-2"
                  >
                    <div className="p-2 rounded-lg border border-green-500/20 group-hover:border-green-500/40 transition-colors">
                      <item.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors tracking-tight">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 text-green-700 hover:bg-green-50 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-green-100 z-[500]"
            >
              <div className="bg-gradient-to-b from-white to-green-50/30 px-4 pt-2 pb-3 z-[500]">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gradient-to-br hover:from-green-500/10 hover:to-emerald-600/10 group transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-sm group-hover:shadow-md transition-all">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                          {item.label}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
