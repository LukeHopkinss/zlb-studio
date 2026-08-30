import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Logo from '../components/Logo';

const SplashScene = ({onEnter}) => {
  return(
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      {/* Logo renders drei's <Text>, which suspends while troika preloads the
          Allura font. That suspension has to be caught INSIDE the canvas: if
          it reaches a boundary outside, r3f's <Canvas> re-throws it, React
          hides the subtree and tears down its effects, and the teardown calls
          forceContextLoss() on the WebGL context — which is never recreated,
          so the logo freezes mid-spin. DotBust wraps its useGLTF model the
          same way for the same reason. */}
      <Suspense fallback={null}>
        <Logo onClick={onEnter} />
      </Suspense>
    </Canvas>
  );
};

export default SplashScene;
