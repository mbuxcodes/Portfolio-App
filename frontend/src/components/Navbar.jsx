import { useState, useRef, useEffect, useId } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const navLinks = [
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
];

// Tailwind's default `md` breakpoint (768px) — the same width this app's
// nav content switches from cramped to comfortable, so it's the natural
// place to switch from the hamburger to the inline desktop links. Kept as
// a named constant (not a magic number) because the resize-close effect
// below has to know this exact value too, and duplicating "768" in two
// places invites the two silently drifting apart later.
const MOBILE_BREAKPOINT_PX = 768;

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const firstMobileLinkRef = useRef(null);
  const mobileMenuId = useId();
  const location = useLocation();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Safety net for browser back/forward navigation while the menu is open:
  // clicking a link already closes it (via each Link's own onClick below),
  // but a route change can also happen without a click on one of these
  // links at all.
  useEffect(() => {
    closeMobileMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    // Move focus into the menu on open — standard expectation for a
    // keyboard/screen-reader user activating a disclosure control — and
    // lock background scroll, same technique already used by Modal.jsx
    // for the same reason (an open overlay scrolling the page behind it
    // is disorienting either way).
    firstMobileLinkRef.current?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMobileMenu();
        menuButtonRef.current?.focus();
      }
    }

    // Outside-click close: mousedown (not click) fires before a click on
    // a link inside the menu would otherwise register, but that's exactly
    // what we want here — the link's own onClick handles its own close,
    // and this only needs to catch clicks that land outside the header
    // entirely (backdrop, page content, etc.).
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        closeMobileMenu();
      }
    }

    // If the viewport crosses back into desktop width while the menu is
    // open (window resize, or a device rotation), the desktop nav is now
    // visible on its own — leaving the mobile menu "open" underneath it
    // would keep the page scroll-locked for no visible reason.
    function handleResize() {
      if (window.innerWidth >= MOBILE_BREAKPOINT_PX) {
        closeMobileMenu();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinkClassName = ({ isActive }) =>
    `border-b-2 pb-1 text-small font-medium transition-colors ${
      isActive
        ? "border-primary text-primary"
        : "border-transparent text-muted hover:text-foreground"
    }`;

  const mobileNavLinkClassName = ({ isActive }) =>
    `block rounded-[--radius] px-md py-sm text-body font-medium transition-colors ${
      isActive ? "bg-surface text-primary" : "text-foreground hover:bg-surface"
    }`;

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur"
    >
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-md py-sm">
        <Link to="/" className="text-h3 font-semibold text-foreground">
          Your Name
        </Link>

        {/* Desktop links — unchanged from before, just now explicitly
            hidden below `md` (previously unconditional `flex`, so this is
            visually identical at md and above). */}
        <ul className="hidden items-center gap-lg md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={navLinkClassName}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Hamburger toggle — mobile only. A real <button> (not a clickable
            div/span) so it's focusable and Enter/Space-activatable for
            free, with no custom key handling needed for the toggle itself. */}
        <button
          ref={menuButtonRef}
          type="button"
          className="inline-flex items-center justify-center rounded-[--radius] p-2 text-foreground hover:bg-surface md:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-controls={mobileMenuId}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          {isMobileMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/*
        Smooth open/close via the CSS grid-rows technique (0fr <-> 1fr)
        rather than animating max-height or measuring content height in
        JS: it animates to the content's real height exactly, works with
        content of any length, and needs no ResizeObserver or hardcoded
        max-height guess. Requires no new dependency — plain Tailwind
        arbitrary-value utilities, consistent with how the rest of this
        file already uses arbitrary values (`rounded-[--radius]`).
        `md:hidden` keeps this entire panel out of the layout regardless
        of `isMobileMenuOpen` at desktop widths — the source of truth for
        "are we on mobile" stays CSS media queries, not JS, so there's no
        flash-of-wrong-nav on initial render at any viewport size.
      */}
      <div
        className={`grid md:hidden ${
          isMobileMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        } transition-[grid-template-rows] duration-300 ease-in-out`}
      >
        <nav id={mobileMenuId} aria-label="Mobile" className="overflow-hidden">
          <ul className="flex flex-col gap-1 border-t border-border px-md py-sm">
            {navLinks.map((link, index) => (
              <li key={link.to}>
                <NavLink
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  to={link.to}
                  className={mobileNavLinkClassName}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
