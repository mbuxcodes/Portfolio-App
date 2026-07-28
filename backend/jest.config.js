/**
 * Our backend uses native ES modules ("type": "module" in package.json).
 * We initially used Node's experimental VM modules support to avoid adding
 * Babel (fewer dependencies, no extra build step). Testing revealed that
 * doesn't actually work reliably: a transitive dependency (sanitize-html
 * -> htmlparser2, which is pure ESM) requires Node v24.9+ for the specific
 * synchronous VM module API involved — meaning anyone on an earlier Node
 * version (as we are here: v22) would hit an identical failure. Switching
 * to babel-jest, which is broadly compatible across Node versions and
 * doesn't depend on a bleeding-edge experimental API. This transform is
 * used only by Jest — the real app still runs as native ESM in dev/prod.
 */
export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: [], // transform node_modules too, so ESM-only deps like htmlparser2 load correctly
  testMatch: ["**/tests/**/*.test.js"],
  setupFiles: ["<rootDir>/tests/setup.js"],
};
