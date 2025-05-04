/**
 * Utilities for generating Schema.org structured data
 */

export function generateSchemaOrgWebPage(
  title: string,
  description: string,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: url,
    isPartOf: {
      "@type": "WebSite",
      name: "खजुरा गाउँपालिका डिजिटल प्रोफाइल",
      url: "https://digprofile.com/khajura",
    },
  };
}

export function generateSchemaOrgBreadcrumbList(
  breadcrumbs: Array<{ name: string; item: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.item,
    })),
  };
}

export function generateSchemaOrgDataset(
  name: string,
  description: string,
  url: string,
  keywords: string[],
  creator: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: name,
    description: description,
    url: url,
    keywords: keywords.join(","),
    creator: {
      "@type": "Organization",
      name: creator,
    },
    publisher: {
      "@type": "Organization",
      name: "खजुरा गाउँपालिका",
      url: "https://digprofile.com/khajura",
    },
    temporalCoverage: `${new Date().getFullYear() - 5}/${new Date().getFullYear()}`,
    spatialCoverage: {
      "@type": "Place",
      name: "खजुरा गाउँपालिका, बाँके, नेपाल",
    },
  };
}

export function generateSchemaOrgArticle(
  title: string,
  description: string,
  url: string,
  datePublished: string,
  dateModified: string,
  image?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    datePublished: datePublished,
    dateModified: dateModified,
    url: url,
    image: image || `https://digprofile.com/khajura/images/og-image.jpg`,
    author: {
      "@type": "Organization",
      name: "खजुरा गाउँपालिका",
    },
    publisher: {
      "@type": "Organization",
      name: "खजुरा गाउँपालिका",
      logo: {
        "@type": "ImageObject",
        url: "https://digprofile.com/khajura/images/logo.png",
      },
    },
    isAccessibleForFree: "True",
    inLanguage: "ne-NP",
  };
}

export function generateSchemaOrgFAQPage(
  questions: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function generateSchemaOrgTable(
  caption: string,
  columns: string[],
  rows: Array<Record<string, string | number>>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Table",
    about: caption,
    mainContentOfPage: false,
  };
}
