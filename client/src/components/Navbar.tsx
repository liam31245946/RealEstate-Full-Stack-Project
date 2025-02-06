import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';
import { TbHomeStar } from 'react-icons/tb';
export function Navbar() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();

  const handleUploadClick = () => {
    if (!user || user.role !== 'agent') {
      alert('Only Agent can upload properties');
      navigate('/sign-in ');
    } else {
      navigate('/upload');
    }
  };
  const handleSignOutNavigate = () => {
    handleSignOut();
    navigate('/');
  };
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
        <li>
          <Link to="/favorites" className="hover:text-orange-500">
            Save
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
          <>
            {user.role === 'agent' && (
              <li>
                <button
                  onClick={handleUploadClick}
                  className="hover:text-blue-400">
                  Upload
                </button>
              </li>
            )}
            <li>
              <button
                onClick={handleSignOutNavigate}
                className="hover:text-blue-400">
                Sign Out
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
