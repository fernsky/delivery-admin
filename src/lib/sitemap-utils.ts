import fs from 'fs';
import path from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { locales } from '@/i18n/config';
import { api } from "@/trpc/server";

// Base URL from environment or default
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://digital.khajuramun.gov.np';

interface SitemapRoute {
  url: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  lastmod?: string | Date;
}

/**
 * Generate and save a sitemap for a specific category and locale
 */
export async function generateCategorySitemap(locale: string, category: string): Promise<void> {
  const routes: SitemapRoute[] = [];
  const currentDate = new Date();
  
  try {
    // Add routes based on category
    switch (category) {
      case 'demographics':
        routes.push(
          { url: `/${locale}/profile/demographics`, changefreq: 'weekly', priority: 0.8, lastmod: currentDate },
          { url: `/${locale}/profile/demographics/ward-wise-religion-population`, changefreq: 'monthly', priority: 0.7, lastmod: currentDate }
        );
        
        // Add dynamic routes from database
        const religionData = await api.profile.demographics.wardWiseReligionPopulation.getAll.query();
        const wardNumbers = Array.from(new Set(religionData.map(item => item.wardNumber))).sort((a, b) => a - b);
        
        wardNumbers.forEach(ward => {
          routes.push({
            url: `/${locale}/profile/demographics/ward-wise-religion-population/${ward}`, 
            changefreq: 'monthly', 
            priority: 0.6, 
            lastmod: currentDate
          });
        });
        break;
        
      // Add other categories as needed
      default:
        // Default routes for unknown category
        routes.push({ url: `/${locale}`, changefreq: 'daily', priority: 1.0, lastmod: currentDate });
    }

    // Create sitemap
    const stream = new SitemapStream({ hostname: baseUrl });
    
    // Add all routes to the sitemap
    routes.forEach(route => {
      stream.write({
        url: route.url,
        changefreq: route.changefreq,
        priority: route.priority,
        lastmod: route.lastmod ? new Date(route.lastmod).toISOString() : new Date().toISOString()
      });
    });
    
    // End the stream
    stream.end();
    
    // Convert the stream to XML
    const sitemap = await streamToPromise(Readable.from(stream)).then(data => data.toString());
    
    // Ensure directory exists
    const dir = path.join(process.cwd(), 'public', 'sitemaps', locale);
    fs.mkdirSync(dir, { recursive: true });
    
    // Write sitemap to file
    fs.writeFileSync(path.join(dir, `${category}-sitemap.xml`), sitemap);
    
    console.log(`Generated sitemap for ${locale}/${category}`);
  } catch (error) {
    console.error(`Error generating sitemap for ${locale}/${category}:`, error);
  }
}

/**
 * Generate a sitemap index file that references all other sitemaps
 */
export async function generateSitemapIndex(): Promise<void> {
  try {
    // Define categories for which we have sitemaps
    const categories = ['main', 'demographics', 'education', 'health', 'infrastructure', 'economy', 'maps'];
    
    // Create sitemap index
    const smis = new SitemapStream({ hostname: baseUrl });
    
    // Add entries for each locale and category
    for (const locale of locales) {
      for (const category of categories) {
        smis.write({
          url: `/sitemaps/${locale}/${category}-sitemap.xml`,
          lastmod: new Date().toISOString()
        });
      }
    }
    
    // End the stream
    smis.end();
    
    // Convert the stream to XML
    const sitemapIndex = await streamToPromise(Readable.from(smis)).then(data => data.toString());
    
    // Write sitemap index to file
    fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-index.xml'), sitemapIndex);
    
    console.log('Generated sitemap index');
  } catch (error) {
    console.error('Error generating sitemap index:', error);
  }
}
