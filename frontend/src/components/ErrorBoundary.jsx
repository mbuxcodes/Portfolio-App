import { Component } from "react";
import Button from "@/components/Button";

/**
 * Catches unhandled render errors anywhere in the component tree below it
 * and shows a recoverable fallback instead of a blank white screen. This
 * closes a gap flagged in the Milestone 1 code review — with real data
 * fetching now happening on every page, an uncaught error (a malformed API
 * response, an unexpected null field, etc.) previously had zero safety net.
 *
 * Deliberately a single, app-level boundary rather than one per route or
 * per feature — for a site this size, one boundary catching everything is
 * simpler (KISS) and still fully solves the "blank screen" failure mode.
 * Error tracking (Sentry) is intentionally deferred per Phase 21's decision;
 * this logs to the console for now, same as the rest of the app's current
 * observability level.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // TODO (future step, once Sentry is added per Phase 21): report here instead of console.error.
    console.error("Unhandled error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-sm px-md text-center">
          <h1>Something went wrong</h1>
          <p className="max-w-md text-muted">
            An unexpected error occurred. Please try reloading the page — if the
            problem continues, please reach out via email.
          </p>
          <Button variant="primary" onClick={this.handleReload}>
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
