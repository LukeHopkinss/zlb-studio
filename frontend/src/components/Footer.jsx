import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="px-6 pt-10 pb-32 sm:pb-44 lg:pb-52 text-sm text-neutral-400 border-t border-white/15">
      <div className="max-w-5xl mx-auto flex flex-wrap justify-between gap-6">
        <p>© {new Date().getFullYear()} zlb studio</p>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-3">
          <Link to="/privacy" className="hover:text-white underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white underline">Terms of Service</Link>
          <a href="/sitemap.xml" className="hover:text-white underline">Sitemap</a>
        </nav>
      </div>
    </footer>
  );
}
