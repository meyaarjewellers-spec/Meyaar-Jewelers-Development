import { Helmet } from "react-helmet-async";

const SITE = "Meyaar Jewellers";
const BASE_URL = "https://meyaarjewellers.com";

interface SeoProps {
  title: string;
  description?: string;
  /** Path (e.g. "/shop/necklaces") used for canonical + og:url. */
  path?: string;
  image?: string;
  /** Render as a product page (og:type=product). */
  type?: "website" | "product" | "article";
  /** Optional JSON-LD object(s) to inject. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

const DEFAULT_DESC =
  "Handcrafted artisan luxury jewelry from Meyaar Jewellers — limited-edition necklaces, bracelets, and earrings made with timeless Pakistani-inspired craftsmanship.";

export default function Seo({ title, description = DEFAULT_DESC, path, image, type = "website", jsonLd, noIndex }: SeoProps) {
  const fullTitle = title === SITE ? title : `${title} · ${SITE}`;
  const url = path ? `${BASE_URL}${path}` : BASE_URL;
  const img = image || `${BASE_URL}/favicon.png`;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(block)}</script>
      ))}
    </Helmet>
  );
}

export { BASE_URL };
