import { Link } from 'react-router-dom';
import { useUser } from './useUser';
import { TbHomeStar } from 'react-icons/tb';
export function Navbar() {
  const { user, handleSignOut } = useUser();
  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold">
        <TbHomeStar />
        <Link to="/">DreamHome</Link>
      </div>
      <ul className="hidden md:flex space-x-6">
        <li>
          <Link to="/" className="hover:text-orange-500">
            Home
          </Link>
        </li>
        {!user ? (
          <>
            <li>
              <Link to="/sign-in" className="hover:text-blue-400">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/sign-up" className="hover:text-blue-400">
                Sign Up
              </Link>
            </li>
          </>
        ) : (
          <li>
            <button
              onClick={handleSignOut}
              className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600">
              Sign Out
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
