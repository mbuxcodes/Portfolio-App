function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-sm px-md py-xl text-center">
        {/* Placeholder — replaced by dynamic SocialLink data in Milestone 2 */}
        <div className="flex gap-md text-small text-muted">
          <span>GitHub</span>
          <span>LinkedIn</span>
          <span>Email</span>
        </div>

        {/* Placeholder — replaced by real resume download link once /api/resume exists */}
        <a href="#" className="text-small font-medium text-primary hover:text-primary-hover">
          Download Resume
        </a>

        <p className="text-small text-muted-foreground">
          &copy; {currentYear} Your Name. Built with the MERN stack.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
