import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes rich-text fields (project problem/solution/results, about bio,
 * etc.) before they're saved — per Architecture Doc 16, this defends against
 * stored XSS even though the only author is the admin, since a compromised
 * admin session should still not be able to inject scripts that run in
 * every visitor's browser.
 *
 * Allows a small set of safe formatting tags (for basic rich text), strips
 * everything else including <script>, event handlers, and iframes.
 */
export function sanitizeRichText(input) {
  return sanitizeHtml(input, {
    allowedTags: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li", "a"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
