import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "@/components/PublicLayout";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";

import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import ContactPage from "@/pages/ContactPage";
import NotFoundPage from "@/pages/NotFoundPage";

/**
 * Every admin-only component is lazy-loaded (Architecture Doc 18's
 * performance decision, implemented here): AdminLayout and all admin pages
 * live in a separate chunk that a public visitor never downloads, since
 * they never render anything under /admin/*. ProtectedRoute stays eager —
 * it's a tiny auth-check/redirect, not worth its own chunk, and it's needed
 * to gate the route regardless of which admin page is being lazy-loaded.
 */
const AdminLayout = lazy(() => import("@/components/AdminLayout"));
const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(
  () => import("@/pages/admin/AdminDashboardPage"),
);
const AdminProjectsPage = lazy(() => import("@/pages/admin/AdminProjectsPage"));
const AdminProjectFormPage = lazy(
  () => import("@/pages/admin/AdminProjectFormPage"),
);
const AdminSkillsPage = lazy(() => import("@/pages/admin/AdminSkillsPage"));
const AdminExperiencePage = lazy(
  () => import("@/pages/admin/AdminExperiencePage"),
);
const AdminEducationPage = lazy(
  () => import("@/pages/admin/AdminEducationPage"),
);
const AdminAboutPage = lazy(() => import("@/pages/admin/AdminAboutPage"));
const AdminMessagesPage = lazy(() => import("@/pages/admin/AdminMessagesPage"));
const AdminResumePage = lazy(() => import("@/pages/admin/AdminResumePage"));
const AdminSocialLinksPage = lazy(
  () => import("@/pages/admin/AdminSocialLinksPage"),
);

/**
 * One shared wrapper instead of repeating <Suspense fallback={...}> at
 * every single route definition (DRY) — every lazy admin element is
 * wrapped the same way, with the same loading UI.
 */
function withSuspense(Component) {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading" />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    // Public site — wrapped in Navbar/Footer via PublicLayout. Nothing here
    // is lazy: these are exactly the components a visitor needs immediately.
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/projects", element: <ProjectsPage /> },
      { path: "/projects/:slug", element: <ProjectDetailPage /> },
      { path: "/contact", element: <ContactPage /> },
    ],
  },
  {
    path: "/admin/login",
    element: withSuspense(AdminLoginPage),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: withSuspense(AdminLayout),
        children: [
          { index: true, element: withSuspense(AdminDashboardPage) },
          { path: "projects", element: withSuspense(AdminProjectsPage) },
          { path: "projects/new", element: withSuspense(AdminProjectFormPage) },
          {
            path: "projects/:id/edit",
            element: withSuspense(AdminProjectFormPage),
          },
          { path: "skills", element: withSuspense(AdminSkillsPage) },
          { path: "experience", element: withSuspense(AdminExperiencePage) },
          { path: "education", element: withSuspense(AdminEducationPage) },
          { path: "about", element: withSuspense(AdminAboutPage) },
          { path: "messages", element: withSuspense(AdminMessagesPage) },
          { path: "resume", element: withSuspense(AdminResumePage) },
          { path: "social-links", element: withSuspense(AdminSocialLinksPage) },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
