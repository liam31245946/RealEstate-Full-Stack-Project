import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from './UserContext';

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const user = (await res.json()) as User;
      alert(`Successfully registered ${user.username}. Welcome to DreamHome.`);
      navigate('/sign-in');
    } catch (err) {
      setError(`Error registering user: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              pattern="[a-zA-Z0-9]+"
              title="Username must be alphanumeric"
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 p-2 shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-white"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              title="Password must be at least 8 characters"
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 p-2 shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-white"
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-300">
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 p-2 shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-white">
              <option value="">Select Your Role</option>
              <option value="buyer">Buyer</option>
              <option value="agent">Seller</option>
            </select>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50">
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
