import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useLogoutMutation, useGetCsrfTokenQuery } from '@/features/auth/authApi';
import Button from '@/components/Button';

const adminNavLinks = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Projects', to: '/admin/projects' },
  { label: 'About', to: '/admin/about' },
  { label: 'Messages', to: '/admin/messages' },
  { label: 'Resume', to: '/admin/resume' },
  { label: 'Social Links', to: '/admin/social-links' },
];

function AdminLayout() {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  // Fetched once when the admin panel mounts (i.e., after a successful login) —
  // the token is dispatched into authSlice by authApi's onQueryStarted,
  // then read by apiSlice's prepareHeaders on every subsequent mutation.
  useGetCsrfTokenQuery();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col justify-between border-r border-border bg-surface p-md">
        <div>
          <h2 className="pb-lg text-h3">Admin</h2>
          <nav className="flex flex-col gap-1">
            {adminNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin'}
                className={({ isActive }) =>
                  `rounded-[--radius] px-sm py-2 text-small font-medium transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : 'text-muted hover:bg-border/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          Log Out
        </Button>
      </aside>

      <main className="flex-1 p-lg">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
