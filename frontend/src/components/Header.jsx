import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const handleClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-15 left-15 w-full z-50 p-4">
      <Link
        to="/"
        onClick={handleClick}
        className="font-allura text-white font-bold text-8xl hover:text-gray-700 transition duration-300"
      >
        z
      </Link>
    </div>
  );
}