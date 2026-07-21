import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/features/auth/authApi';
import Input from '@/components/Input';
import Button from '@/components/Button';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await login(formData).unwrap();
      navigate('/admin');
    } catch (err) {
      setError(err?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-[400px] flex-col justify-center px-md">
      <h1 className="pb-lg text-center">Admin Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && (
          <p role="alert" className="text-small text-danger">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>
    </div>
  );
}

export default AdminLoginPage;
