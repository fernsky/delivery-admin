import { NextRequest } from 'next/server';
import { getServerSideSitemap } from 'next-sitemap';
import { api } from "@/trpc/server";
import { locales } from '@/i18n/config';

// Base URL from environment or default
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://khajura-delivery.vercel.app';

export async function GET(request: NextRequest, context: { params: { locale: string, category: string } }) {
  const { locale, category } = context.params;
  
  // Validate locale
  if (!locales.includes(locale as "en" | "ne")) {
    return new Response('Invalid locale', { status: 400 });
  }
  
  // Define current date for lastModified
  const currentDate = new Date().toISOString();
  
  // Initialize empty sitemap array
  const sitemapEntries = [];
  
  // Generate different entries based on category
  switch (category) {
    case 'main':
      // Main static pages
      sitemapEntries.push(
        { loc: `${baseUrl}/${locale}`, lastmod: currentDate, changefreq: 'daily', priority: 1.0 },
        { loc: `${baseUrl}/${locale}/profile`, lastmod: currentDate, changefreq: 'weekly', priority: 0.9 }
      );
      break;
      
    case 'demographics':
      // Demographics pages
      sitemapEntries.push(
        { loc: `${baseUrl}/${locale}/profile/demographics`, lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
        { loc: `${baseUrl}/${locale}/profile/demographics/ward-wise-religion-population`, lastmod: currentDate, changefreq: 'monthly', priority: 0.7 }
      );
      
      try {
        // Fetch dynamic content for demographics
        const religionData = await api.profile.demographics.wardWiseReligionPopulation.getAll.query();
        const wardNumbers = Array.from(new Set(religionData.map(item => item.wardNumber))).sort((a, b) => a - b);
        
        // Add ward-specific pages
        for (const ward of wardNumbers) {
          sitemapEntries.push({
            loc: `${baseUrl}/${locale}/profile/demographics/ward-wise-religion-population/${ward}`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: 0.6,
          });
        }
      } catch (error) {
        console.error('Error fetching religion data for sitemap:', error);
      }
      break;
      
    case 'education':
      // Education pages
      sitemapEntries.push(
        { loc: `${baseUrl}/${locale}/profile/education`, lastmod: currentDate, changefreq: 'weekly', priority: 0.8 }
        // Add more education related pages as needed
      );
      break;
      
    case 'health':
      // Health pages
      sitemapEntries.push(
        { loc: `${baseUrl}/${locale}/profile/health`, lastmod: currentDate, changefreq: 'weekly', priority: 0.8 }
        // Add more health related pages as needed
      );
      break;
      
    case 'infrastructure':
      // Infrastructure pages
      sitemapEntries.push(
        { loc: `${baseUrl}/${locale}/profile/infrastructure`, lastmod: currentDate, changefreq: 'weekly', priority: 0.8 }
        // Add more infrastructure related pages as needed
      );
      break;
      
    case 'economy':
      // Economy pages
      sitemapEntries.push(
        { loc: `${baseUrl}/${locale}/profile/economy`, lastmod: currentDate, changefreq: 'weekly', priority: 0.8 }
        // Add more economy related pages as needed
      );
      break;
      
    case 'maps':
      // Maps pages
      sitemapEntries.push(
        { loc: `${baseUrl}/${locale}/profile/maps`, lastmod: currentDate, changefreq: 'weekly', priority: 0.8 }
        // Add more maps related pages as needed
      );
      break;
      
    default:
      // Invalid category
      return new Response('Invalid sitemap category', { status: 400 });
  }
  
  // Return XML sitemap
  //@ts-ignore
  return getServerSideSitemap(sitemapEntries);
}

export const dynamic = 'force-dynamic'; // Make sure the sitemap is generated on-demand
