/**
 * Converts a title into a URL-safe slug.
 * "My Awesome Project!" -> "my-awesome-project"
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // strip anything that isn't a word char, space, or hyphen
    .replace(/[\s_]+/g, "-") // collapse spaces/underscores into a single hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}
