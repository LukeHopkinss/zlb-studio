import {motion} from 'framer-motion';
import { useRef, useState, useEffect, act} from 'react';
import NavbarHighlight from './NavbarHighlight';
import { useLocation, Link } from 'react-router-dom'

const links = [
  { label: 'Work', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' }
];


export default function Navbar() {

    const [active, setActive] = useState(null);
    const [layout, setLayout] = useState({ left: 0, width: 0 });
    const refs = useRef([]);
    const location = useLocation();

    const handleClick = (index) => {
        const rect = refs.current[index].getBoundingClientRect();
        setLayout({left: rect.left, width: rect.width});
        setActive(index);
    };

    useEffect(() => {

        const currentPath = location.pathname.toLowerCase();
        let matchedIndex;
        if (currentPath === '/') {
        matchedIndex = 0; 
        } 
        
        else {
        matchedIndex = links.findIndex((link) => link.path.toLowerCase() === currentPath);
        }

        setTimeout(() => {
            if (refs.current[matchedIndex]) {
            const rect = refs.current[matchedIndex].getBoundingClientRect();
            setLayout({ left: rect.left, width: rect.width });
            setActive(matchedIndex);
            }
        }, 50);
    }, [location]);

    useEffect(() => {
        const handleResize = () => {
            if(refs.current[active]){
                const rect = refs.current[active].getBoundingClientRect();
                setLayout({left: rect.left, width: rect.width});
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [active]);

    return(
        <div className='fixed bottom-0 left-0 w-full bg-transparent text-white py-15 z-50'>
            <div className='flex justify-center gap-10'>

                <NavbarHighlight layout={layout}/>

                {links.map((link, i) => (
                    <motion.div
                        key={i}
                        ref={(el) => (refs.current[i] = el)}
                        onClick={() => handleClick(i)}
                        style={{ fontFamily: 'creato' }}
                        className={`cursor-pointer text-3xl px-4 py-2 transition-all ${active === i ? "text-black" : "text-white"}`}
                    >
                        <Link to={link.path} className="block w-full h-full">
                        {link.label}
                        </Link>
                    </motion.div>
                    ))}
            </div>
        </div>
    );
}