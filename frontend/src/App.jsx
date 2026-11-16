import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './index.css';
import MainPage from './scenes/MainPage';
import CaseStudy from './scenes/CaseStudy';
import Contact from './scenes/Contact';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import Legal from './scenes/Legal';
import ScrollToTop from './components/ScrollToTop';

// Both of these pull in three.js / @react-three/*, which is the bulk of the
// JS bundle. Lazy-loading keeps that out of the initial download for repeat
// visits and for every route that never shows 3D. Loading About lazily also
// defers DotBust's module-scope useGLTF.preload of the 1.7MB luke3d.glb, so
// that model is only fetched on the one route that actually renders it.
const SplashScene = lazy(() => import('./scenes/SplashScene'));
const About = lazy(() => import('./scenes/About'));

const SPLASH_SEEN_KEY = 'zlb:splash-seen';

// sessionStorage throws in some privacy modes; never let that break the page.
const splashAlreadySeen = () => {
  try {
    return sessionStorage.getItem(SPLASH_SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

const pageTransition = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.5 },
};

// The splash hides the first home-page entrance. Keep repeat visits in the
// same position rather than revealing a vertical slide only after reload.
const homeTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
};

function App() {

  const location = useLocation();

  const [showSplash, setShowSplash] = useState(
    () => location.pathname === '/' && !splashAlreadySeen()
  );

  useEffect(() => {
    if(location.pathname !== '/'){
        setShowSplash(false);
    }
  }, [location.pathname]);

  // Keep the page behind the splash from scrolling while it's covered.
  useEffect(() => {
    if (!showSplash) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showSplash]);

  const handleEnter = () => {
    try {
      sessionStorage.setItem(SPLASH_SEEN_KEY, '1');
    } catch {
      // Non-fatal: the splash just shows again next navigation.
    }
    setShowSplash(false);
  };

  return (
    <div
  className="relative bg-black w-full min-h-screen">

      {/* The real page is always mounted, even while the splash covers it.
          Previously it lived in the falsy branch of a ternary, so crawlers
          (which run JS but never click) saw an empty <canvas> and no links,
          leaving the whole site unindexable and the case studies
          undiscoverable. The splash is now purely an overlay on top. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative inset-0 z-20"
      >
        <Header/>
        <Navbar/>

        <ScrollToTop />
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<motion.div {...homeTransition}><MainPage /></motion.div>} />
          <Route path="/work/:slug" element={<motion.div {...pageTransition}><CaseStudy /></motion.div>} />
          <Route
            path="/about"
            element={
              <motion.div {...pageTransition}>
                <Suspense fallback={<div className="min-h-screen bg-black" />}>
                  <About />
                </Suspense>
              </motion.div>
            }
          />
          <Route path="/contact" element={<motion.div {...pageTransition}><Contact /></motion.div>} />
          <Route path="/privacy" element={<Legal kind="privacy" />} />
          <Route path="/terms" element={<Legal kind="terms" />} />
          <Route path="*" element={<main className="min-h-[70svh] px-6 pt-44 text-white"><h1 className="text-4xl">Page not found</h1><a href="/" className="inline-block mt-6 underline">Back to work</a></main>} />
        </Routes>
        <Footer />
      </motion.div>

      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[200] bg-black"
            // Stop swallowing clicks the moment it's dismissed. The element
            // stays mounted through the exit fade, and rAF-driven animations
            // pause in background tabs — so without this a backgrounded fade
            // can leave a full-screen overlay eating every click.
            style={{ pointerEvents: showSplash ? "auto" : "none" }}
          >
            <Suspense fallback={<div className="w-full h-full bg-black" />}>
              <SplashScene onEnter={handleEnter} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
