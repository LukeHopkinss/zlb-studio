import { Suspense, useMemo, useRef } from "react";
import { Canvas, createPortal, useFrame } from "@react-three/fiber";
import { Center, useFBO, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function BustModel({ rotationRef }) {
  const { scene } = useGLTF("/models/luke3d.glb");
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      const state = rotationRef.current;
      if (!state.dragging) {
        state.rotationY += delta * 0.3;
      }
      groupRef.current.rotation.y = state.rotationY;
    }
  });

  return (
    <group ref={groupRef}>
      <Center position={[0, -0.05, 0]}>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

useGLTF.preload("/models/luke3d.glb");

const DOT_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Clip-space quad: ignores camera/model matrices entirely so this pass
    // always exactly covers the screen, regardless of which camera renders it.
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const DOT_FRAGMENT_SHADER = `
  uniform sampler2D uScene;
  uniform vec2 uResolution;
  uniform float uCell;
  uniform float uLo;
  uniform float uHi;
  varying vec2 vUv;

  void main() {
    vec2 fragCoord = vUv * uResolution;
    vec2 cellCenter = (floor(fragCoord / uCell) + 0.5) * uCell;
    vec3 color = texture2D(uScene, cellCenter / uResolution).rgb;
    // The offscreen target stores linear color; gamma-encode before reading
    // brightness so uLo/uHi behave the same as they did against the old
    // (already display-encoded) 2D canvas readback.
    vec3 encoded = pow(max(color, 0.0), vec3(1.0 / 2.2));
    float l = dot(encoded, vec3(0.299, 0.587, 0.114));
    float v = clamp((l - uLo) / max(uHi - uLo, 0.0001), 0.0, 1.0);
    if (v <= 0.12) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }
    float r = (uCell * 0.5) * 1.05 * pow(v, 1.4);
    float d = distance(fragCoord, cellCenter);
    float dot_ = 1.0 - smoothstep(r - 1.0, r + 1.0, d);
    gl_FragColor = vec4(vec3(dot_), 1.0);
  }
`;

// Renders the bust into an offscreen target, then converts that render to
// brightness-sized dots with a single fullscreen shader pass — both steps run
// back to back inside one WebGL render, so the dot pass always reads the
// frame that was just drawn. The previous version instead read the rendered
// pixels back into a separate 2D canvas on its own timer; that extra,
// independently-scheduled hop was never guaranteed to land in the same frame
// it was reading from, which is what produced the smearing/ghosting. A GPU
// pass has no separate schedule to fall out of sync with.
function DotRenderer({ rotationRef }) {
  const fboScene = useMemo(() => new THREE.Scene(), []);
  const fbo = useFBO(1, 1);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uScene: { value: fbo.texture },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uCell: { value: 1 },
          uLo: { value: 0.02 },
          uHi: { value: 0.55 },
        },
        vertexShader: DOT_VERTEX_SHADER,
        fragmentShader: DOT_FRAGMENT_SHADER,
      }),
    [fbo]
  );

  useFrame((state) => {
    const pr = state.gl.getPixelRatio();
    const w = Math.round(state.size.width * pr);
    const h = Math.round(state.size.height * pr);
    if (fbo.width !== w || fbo.height !== h) {
      fbo.setSize(w, h);
    }
    material.uniforms.uResolution.value.set(w, h);
    material.uniforms.uCell.value = 3.5 * pr;

    state.gl.setRenderTarget(fbo);
    state.gl.render(fboScene, state.camera);
    state.gl.setRenderTarget(null);
    state.gl.render(state.scene, state.camera);
  }, 1);

  return (
    <>
      {createPortal(
        <>
          <ambientLight intensity={0.25} />
          <directionalLight position={[3, 4, 4]} intensity={2.2} />
          <directionalLight position={[-3, 1, 2]} intensity={0.5} />
          <directionalLight position={[0, 2, -4]} intensity={0.6} />
          <Suspense fallback={null}>
            <BustModel rotationRef={rotationRef} />
          </Suspense>
        </>,
        fboScene
      )}
      <mesh material={material}>
        <planeGeometry args={[2, 2]} />
      </mesh>
    </>
  );
}

export default function DotBust() {
  const rotationRef = useRef({ dragging: false, rotationY: 0, lastX: 0 });

  const handlePointerDown = (e) => {
    rotationRef.current.dragging = true;
    rotationRef.current.lastX = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const state = rotationRef.current;
    if (!state.dragging) return;
    const deltaX = e.clientX - state.lastX;
    state.lastX = e.clientX;
    state.rotationY += deltaX * 0.01;
  };

  const handlePointerUp = (e) => {
    rotationRef.current.dragging = false;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      className="relative w-full h-[440px] sm:h-[560px] lg:h-[680px] cursor-grab touch-none select-none active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 1.6], fov: 50 }} style={{ position: "absolute", inset: 0 }}>
        <DotRenderer rotationRef={rotationRef} />
      </Canvas>
    </div>
  );
}
