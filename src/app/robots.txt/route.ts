import { MetadataRoute } from 'next';

// Base URL from environment or default
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://khajura-delivery.vercel.app';

export function GET(): Response {
  // Generate the robots.txt content
  const robotsTxt = `# *
User-agent: *
Allow: /

# Host
Host: ${baseUrl}

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-index.xml

# Disallow specific patterns if needed
# Disallow: /api/
# Disallow: /admin/
`;

  // Return the response with appropriate content type
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
