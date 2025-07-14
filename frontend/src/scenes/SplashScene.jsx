import React from 'react';
import { Canvas } from '@react-three/fiber';
import Logo from '../components/Logo';

const SplashScene = ({onEnter}) => {
  return(
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <Logo onClick={onEnter} />
    </Canvas>
  );
};

export default SplashScene;