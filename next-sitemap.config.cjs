/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://khajura-delivery.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/admin/*', '/api/*', '/server/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://khajura-delivery.vercel.app'}/sitemap-index.xml`,
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  // Add locale alternates to URLs
  alternateRefs: [
    {
      href: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://khajura-delivery.vercel.app'}/en`,
      hreflang: 'en',
    },
    {
      href: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://khajura-delivery.vercel.app'}/ne`,
      hreflang: 'ne',
    },
  ],
};