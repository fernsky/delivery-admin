import { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { api } from "@/trpc/server";

// Base URL from environment or default
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://khajuramun.digprofile.com";

// Define static routes that should appear in the sitemap
const staticRoutes = [
  "/",
  "/profile",
  "/profile/demographics",
  "/profile/education",
  "/profile/health",
  "/profile/infrastructure",
  "/profile/economy",
  "/profile/maps",
];

// This function will generate the sitemap entries
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];
  const currentDate = new Date();

  // Generate entries for static routes in all locales
  for (const locale of locales) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: route === "/" ? 1.0 : 0.8,
      });
    }
  }

  // Fetch dynamic demographic data routes
  try {
    // Example: Get all the ward-wise religion population data to generate URLs for them
    const religionData =
      await api.profile.demographics.wardWiseReligionPopulation.getAll.query();

    // Get unique ward numbers
    const wardNumbers = Array.from(
      new Set(religionData.map((item) => item.wardNumber)),
    ).sort((a, b) => a - b);

    // Add demographic detail pages for each ward
    for (const locale of locales) {
      // Main demographics/religion page
      const demographicPages = [
        "ward-age-wise-religion-population",
        "ward-age-wise-population",
        "ward-wise-caste-population",
        "ward-wise-househead-gender",
        "ward-wise-mother-tongue-population",
        "ward-wise-religion-population",
        "ward-wise-summary",
      ];

      demographicPages.forEach((page) => {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/profile/demographics/${page}`,
          lastModified: currentDate,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });
    }
  } catch (error) {
    console.error("Error generating dynamic sitemap entries:", error);
  }

  // Add other dynamic routes here as the application grows
  // For example, fetch and add news articles, events, etc.

  return sitemapEntries;
}
