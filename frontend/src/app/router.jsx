import { createBrowserRouter } from 'react-router-dom';

import PublicLayout from '@/components/PublicLayout';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/features/auth/ProtectedRoute';

import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';

import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProjectsPage from '@/pages/admin/AdminProjectsPage';
import AdminAboutPage from '@/pages/admin/AdminAboutPage';
import AdminMessagesPage from '@/pages/admin/AdminMessagesPage';
import AdminResumePage from '@/pages/admin/AdminResumePage';
import AdminSocialLinksPage from '@/pages/admin/AdminSocialLinksPage';

export const router = createBrowserRouter([
  {
    // Public site — wrapped in Navbar/Footer via PublicLayout
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/projects', element: <ProjectsPage /> },
      { path: '/projects/:slug', element: <ProjectDetailPage /> },
      { path: '/contact', element: <ContactPage /> },
    ],
  },
  {
    // Login page: reachable while logged out, so it sits outside ProtectedRoute
    // and outside AdminLayout (no sidebar to show an unauthenticated visitor)
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    // Every other /admin/* route: guarded by ProtectedRoute, then wrapped in AdminLayout
    element: <ProtectedRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'projects', element: <AdminProjectsPage /> },
          { path: 'about', element: <AdminAboutPage /> },
          { path: 'messages', element: <AdminMessagesPage /> },
          { path: 'resume', element: <AdminResumePage /> },
          { path: 'social-links', element: <AdminSocialLinksPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
