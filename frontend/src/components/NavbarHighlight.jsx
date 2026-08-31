import {motion} from 'framer-motion';

export default function NavbarHighlight({layout}){
    return(
        <motion.div
        className='absolute top-1/2 -translate-y-1/2 h-[40%] bg-white rounded-full z-[-1]'
        // The parent only mounts this once a real measurement exists, so the
        // first position is already correct — snap to it, then animate moves.
        initial={false}
        animate={{left: layout.left, width: layout.width}}
        transition={{type: 'spring', stiffness: 300, damping: 30}}
        style={{position: 'absolute'}} />
    );
}
