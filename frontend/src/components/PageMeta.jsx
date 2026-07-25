import { Helmet } from "react-helmet-async";

const SITE_NAME = "Muhammad Bux — Full Stack Developer";
const DEFAULT_DESCRIPTION =
  "Full Stack Developer specializing in the MERN stack — production-grade web applications, built end to end.";

/**
 * One reusable implementation of per-page meta tags (Phase 1's SEO
 * decision: Vite CSR + meta-tag injection via react-helmet-async).
 * Every public page renders this once with its own title/description
 * instead of each page reimplementing <Helmet> directly.
 */
function PageMeta({ title, description = DEFAULT_DESCRIPTION, image }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph — what LinkedIn/Slack/Twitter use to render link previews */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}

      <meta
        name="twitter:card"
        content={image ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}

export default PageMeta;
