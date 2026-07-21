import { Link } from 'react-router-dom';
import Button from '@/components/Button';

function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-[600px] flex-col items-center gap-sm px-md py-2xl text-center">
      <h1>404</h1>
      <p className="text-muted">The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button variant="primary">Back to Home</Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
