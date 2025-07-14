import { useState, useEffect} from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './index.css';
import SplashScene from './scenes/SplashScene';
import MainPage from './scenes/MainPage';
import About from './scenes/About';
import Contact from './scenes/Contact';
import Navbar from './components/Navbar';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';


function App() {

  const location = useLocation();

  const [showSplash, setShowSplash] = useState(() => {
    return location.pathname === '/';
  });

  useEffect(() => {
    if(location.pathname !== '/'){
        setShowSplash(false);
    }
  }, [location.pathname]);

  const handleEnter = () => {
    setShowSplash(false);
  };

  return (
    <div
  className={`relative bg-black w-full min-h-screen ${["/about", "/"].includes(location.pathname) ? "overflow-y-scroll" : "overflow-hidden"}`}>

      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-10">

            <SplashScene onEnter={handleEnter} />

          </motion.div>

        ) : (

          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative inset-0 z-20"
            >
            
            <Header/>
            <Navbar/>

            <ScrollToTop />
            <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <MainPage />
                </motion.div>
              }
            />
            <Route
              path="/about"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <About />
                </motion.div>
              }
            />
            <Route
              path="/contact"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <Contact />
                </motion.div>
              }
            />
          </Routes>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
