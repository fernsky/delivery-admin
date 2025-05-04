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
  };
}
