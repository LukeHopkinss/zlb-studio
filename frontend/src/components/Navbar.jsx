import {motion} from 'framer-motion';
import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import NavbarHighlight from './NavbarHighlight';
import { useLocation, Link } from 'react-router-dom'

const links = [
  { label: 'Work', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' }
];

const matchIndex = (pathname) => {
    const currentPath = pathname.toLowerCase();
    return links.findIndex((link) => {
        const path = link.path.toLowerCase();
        if (path === '/') {
            return currentPath === '/' || currentPath.startsWith('/work/');
        }
        return currentPath === path || currentPath.startsWith(`${path}/`);
    });
};

export default function Navbar() {

    const [layout, setLayout] = useState({ left: 0, width: 0 });
    const refs = useRef([]);
    const containerRef = useRef(null);
    const location = useLocation();

    // Derived rather than state: which link is highlighted is a pure function
    // of the route, so it is right on the first paint instead of a commit late.
    // -1 (an unrecognised route) leaves the pill wherever it last sat.
    const active = matchIndex(location.pathname);

    // The pill is absolutely positioned against the fixed container below, so
    // it has to be placed relative to that container. Viewport coordinates
    // drift the moment anything changes the viewport's usable width — the
    // splash's body{overflow:hidden} hides the 8px scrollbar, which shifts
    // every link ~4px without firing a resize event.
    const measure = useCallback(() => {
        const el = refs.current[active];
        const container = containerRef.current;
        if (!el || !container) return;
        const rect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setLayout({ left: rect.left - containerRect.left, width: rect.width });
    }, [active]);

    // Before paint, so the pill is never seen at a stale position.
    useLayoutEffect(measure, [measure]);

    // 'creato' arrives from an @font-face, so a cold session lays the links out
    // in fallback metrics first — "Work" measures ~14px left of and 6px
    // narrower than where it ends up. The observer below would catch the swap
    // too, but only once the tab is visible; this promise resolves even in a
    // background tab, so a load that starts hidden is already correct.
    useEffect(() => {
        let cancelled = false;
        document.fonts.ready.then(() => {
            if (!cancelled) measure();
        });
        return () => { cancelled = true; };
    }, [measure]);

    // Everything else a one-shot measurement misses: viewport resizes, the
    // breakpoint-driven font-size and gap changes, and the scrollbar coming
    // back when the splash releases body{overflow:hidden} — which moves every
    // link ~4px and fires no resize event. The container catches that one (it
    // narrows by the scrollbar); the links catch anything that only reflows
    // the text inside them.
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(measure);
        observer.observe(container);
        refs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, [measure]);

    return(
        <div
            ref={containerRef}
            className='fixed bottom-0 left-0 w-full bg-transparent text-white py-6 sm:py-10 lg:py-15 z-50'
        >
            <div className='flex justify-center gap-4 sm:gap-6 lg:gap-10'>

                {/* Held back until there is a real measurement, so it fades in
                    under its link instead of springing across from left: 0. */}
                {layout.width > 0 && <NavbarHighlight layout={layout}/>}

                {links.map((link, i) => (
                    <motion.div
                        key={i}
                        ref={(el) => { refs.current[i] = el; }}
                        style={{ fontFamily: 'creato' }}
                    >
                        <Link
                            to={link.path}
                            className={`block cursor-pointer text-lg sm:text-2xl lg:text-3xl px-2 sm:px-3 lg:px-4 py-2 transition-all ${active === i ? "text-black" : "text-white"}`}
                        >
                        {link.label}
                        </Link>
                    </motion.div>
                    ))}
            </div>
        </div>
    );
}
