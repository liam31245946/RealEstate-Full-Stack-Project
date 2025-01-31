import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from './UserContext';

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
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
      alert(
        `Successfully registered ${user.username} as userId ${user.userId}.`
      );
      navigate('/sign-in');
    } catch (err) {
      setError(`Error registering user: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap mb-4">
          <div className="w-1/2">
            <label className="mb-2 block">
              Username
              <input
                required
                name="username"
                type="text"
                pattern="[a-zA-Z0-9]+"
                title="Username must be alphanumeric"
                className="block border border-gray-600 rounded p-2 h-8 w-full mb-2"
              />
            </label>
            <label className="mb-2 block">
              Password
              <input
                required
                name="password"
                type="password"
                minLength={8}
                title="Password must be at least 8 characters"
                className="block border border-gray-600 rounded p-2 h-8 w-full mb-2"
              />
            </label>
            <label className="mb-2 block">
              Role
              <select
                required
                name="role"
                className="block border border-gray-600 rounded p-2 h-8 w-full mb-2">
                <option value=""> Select Your Role</option>
                <option value="registered"> Buyer</option>
                <option value="agent"> Seller</option>
              </select>
            </label>
          </div>
        </div>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button
          disabled={isLoading}
          className="align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
