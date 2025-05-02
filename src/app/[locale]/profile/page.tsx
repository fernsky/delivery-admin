"use client";
import React from "react";
import Hero from "./_components/hero";
import Statistics from "./_components/statistics";
import AboutSection from "./_components/about-section";
import WardInfo from "./_components/ward-info";
import HistoryTimeline from "./_components/history-timeline";
// import InteractiveMap from "./_components/interactive-map";
// import NewsUpdates from "./_components/news-updates";
// import PhotoGallery from "./_components/photo-gallery";
import Footer from "./_components/footer";
import { LanguageParams } from "./_store/types";
import { ParallaxProvider } from "react-scroll-parallax";

export default async function Home({ params }: LanguageParams) {
  const { lng } = params;

  return (
    <ParallaxProvider>
      <main className="min-h-screen bg-gradient-to-b from-white to-green-50/30">
        <Hero lng={lng} />
        <div className="space-y-12 sm:space-y-20">
          <Statistics />
          <AboutSection />
          <WardInfo />
          <HistoryTimeline />
          {/* <InteractiveMap />
          <NewsUpdates />
          <PhotoGallery /> */}
        </div>
        <Footer lng={lng} />
      </main>
    </ParallaxProvider>
  );
}
