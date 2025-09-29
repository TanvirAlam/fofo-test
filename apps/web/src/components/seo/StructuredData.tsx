interface WebSiteData {
  name: string;
  url: string;
  potentialAction?: {
    "@type": string;
    target: string;
    "query-input"?: string;
  };
}

interface OrganizationData {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

interface RestaurantData {
  name: string;
  image?: string;
  address?: {
    "@type": string;
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  telephone?: string;
  servesCuisine?: string[];
}

interface StructuredDataProps {
  type: "WebSite" | "Organization" | "Restaurant";
  data: WebSiteData | OrganizationData | RestaurantData;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org" as const,
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
