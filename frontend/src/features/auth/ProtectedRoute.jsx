import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetMeQuery } from '@/features/auth/authApi';
import LoadingSpinner from '@/components/LoadingSpinner';

/**
 * Guards every /admin/* route.
 *
 * Why we re-verify via useGetMeQuery instead of trusting Redux state alone:
 * the JWT lives in an HTTP-only cookie the client can't read directly, and
 * Redux state resets on every page refresh. So on a hard refresh, the only
 * way to know "is this cookie still valid" is to ask the backend — this
 * query does exactly that, and the backend is the single source of truth
 * for session validity, not the client.
 */
function ProtectedRoute() {
  const { data, isLoading, isError } = useGetMeQuery();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !data?.data) {
    return <Navigate to="/admin/login" replace />;
  }

  return isAuthenticated || data?.data ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default ProtectedRoute;
