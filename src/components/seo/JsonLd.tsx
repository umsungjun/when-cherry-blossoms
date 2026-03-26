import { REGIONS } from "@/lib/data/regions";

const BASE_URL = "https://when-cherry-blossoms.vercel.app";

/** 메인 페이지: WebSite + FAQPage 구조화 데이터 */
export function HomeJsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "벚꽃 언제 필까?",
    url: BASE_URL,
    description:
      "전국 16곳 벚꽃 개화 시기, 만개 날짜, 꽃비 예보, 벚꽃 명소를 한눈에 확인하세요.",
    inLanguage: "ko",
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/regions/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "2026년 벚꽃 개화 시기는 언제인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "2026년 벚꽃은 제주도가 3월 중순으로 가장 빠르고, 서울은 4월 초순, 강원도는 4월 중순에 개화할 것으로 예상됩니다. 지역별 정확한 예측 날짜는 사이트에서 확인하세요.",
        },
      },
      {
        "@type": "Question",
        name: "벚꽃 명소는 어디인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "대표적인 벚꽃 명소로는 서울 여의도 벚꽃길, 부산 삼락생태공원, 제주 전농로, 경주 보문호 등이 있습니다. 전국 16개 지역의 추천 명소를 확인해보세요.",
        },
      },
      {
        "@type": "Question",
        name: "벚꽃 만개와 낙화 시기는 언제인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "벚꽃은 개화 후 약 7일 뒤 만개하며, 만개 후 약 7~10일 사이에 낙화합니다. 비와 바람에 따라 낙화가 앞당겨질 수 있으니 꽃비 예보를 확인하세요.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

/** 지역 상세 페이지: TouristAttraction 구조화 데이터 */
export function RegionJsonLd({ regionId }: { regionId: string }) {
  const region = REGIONS.find((r) => r.id === regionId);
  if (!region) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `${region.name} 벚꽃 명소`,
    description: `${region.name}(${region.province}) 벚꽃 개화 시기와 추천 명소 정보`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: region.lat,
      longitude: region.lng,
    },
    containsPlace: region.famousSpots.map((spot) => ({
      "@type": "TouristAttraction",
      name: spot.name,
      ...(spot.lat &&
        spot.lng && {
          geo: {
            "@type": "GeoCoordinates",
            latitude: spot.lat,
            longitude: spot.lng,
          },
        }),
      ...(spot.imageUrl && { image: spot.imageUrl }),
    })),
    isPartOf: {
      "@type": "WebSite",
      name: "벚꽃 언제 필까?",
      url: BASE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** BreadcrumbList 구조화 데이터 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
