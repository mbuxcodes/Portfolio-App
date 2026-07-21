import { Link, NavLink } from 'react-router-dom';

const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-md py-sm">
        <Link to="/" className="text-h3 font-semibold text-foreground">
          Your Name
        </Link>

        <ul className="flex items-center gap-lg">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `border-b-2 pb-1 text-small font-medium transition-colors ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted hover:text-foreground'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
