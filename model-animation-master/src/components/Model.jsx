"use client";

import { Center, Environment, useGLTF, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { Suspense, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import * as THREE from 'three';

const ModelMesh = ({ scrollprogress }) => {
  const { scene } = useGLTF("/bmw_m3_gtr.glb");
  const groupRef = useRef(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = scrollprogress * Math.PI * 2
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={130} />
    </group>
  );
};

// Smoothly drives the Three.js camera from state values
const CameraController = ({ position, fov, target = new THREE.Vector3(0, 0, 0), lerp = 0.12 }) => {
  const { camera } = useThree();

  useFrame(() => {
    // smooth position using configurable lerp
    camera.position.lerp(new THREE.Vector3(position[0], position[1], position[2]), lerp);

    // update fov when it changes
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    // smoothly look at target
    camera.lookAt(target);
  });

  return null;
};

const Model = () => {
  const [scrollprogress, setscrollprogress] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const orbitRef = useRef(null)
  const scrollTimeout = useRef(null)

  useLenis(({ progress }) => {
    setscrollprogress(progress)
    // mark as scrolling briefly to disable OrbitControls while the user scrolls
    setIsScrolling(true)
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 220)
  })

  // Easing helper for a professional, smooth feel
  const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  const t = easeInOutCubic(scrollprogress)

  // Professional camera mapping using eased progress
  // X: -1.5 -> 1.5 (subtle lateral shift)
  // Y: 0.8 -> -0.5 (slight downward arc)
  // Z: 9 -> 3 (smooth zoom in)
  // FOV: 55 -> 32 (tighter perspective)
  const camX = (t * 3) - 1.5
  const camY = 0.8 - t * 1.3
  const camZ = 9 - t * 6
  const fov = 55 - t * 23

  // Camera target sits slightly below center for a more cinematic look
  const cameraTarget = new THREE.Vector3(0, -0.12, 0)

  // Keep orbit enabled only when not actively scrolling
  React.useEffect(() => {
    if (orbitRef.current) orbitRef.current.enabled = !isScrolling
  }, [isScrolling])

  return (
    <section className="h-screen w-full bg-[#0f172a] relative">
      <Canvas camera={{ position: [camX, camY, camZ], fov }}>
        <color attach="background" args={['#0f172a']} />
        <Suspense fallback={<mesh><boxGeometry args={[2, 2, 2]} /><meshStandardMaterial color="orange" /></mesh>}>
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2} />
          <directionalLight position={[-10, 5, 10]} intensity={2} />
          <Center top>
            <ModelMesh scrollprogress={scrollprogress} />
          </Center>
          <Environment preset="city" />
        </Suspense>

        {/* Smoothly apply camera updates with a more refined lerp */}
        <CameraController position={[camX, camY, camZ]} fov={fov} target={cameraTarget} lerp={0.08} />
        {/* OrbitControls with ref so we can disable during scroll */}
        <OrbitControls ref={orbitRef} enablePan={true} enableZoom={true} />
      </Canvas>

      {/* Polished overlay */}
      <div style={{position: 'absolute', right: 18, top: 18, width: 260, padding: 14, background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))', color: '#fff', borderRadius: 10, fontSize: 13, boxShadow: '0 6px 18px rgba(2,6,23,0.6)'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8}}>
          <div style={{fontWeight:700}}>Camera • Scroll-driven</div>
          <div style={{fontSize:11, opacity:0.8}}>{Math.round(scrollprogress * 100)}%</div>
        </div>

        <div style={{height:6, background:'rgba(255,255,255,0.06)', borderRadius:6, overflow:'hidden', marginBottom:10}}>
          <div style={{height:'100%', width:`${Math.round(scrollprogress * 100)}%`, background:'#60a5fa'}} />
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10}}>
          <div style={{fontSize:12, opacity:0.9}}>X <strong style={{float:'right'}}>{camX.toFixed(2)}</strong></div>
          <div style={{fontSize:12, opacity:0.9}}>Y <strong style={{float:'right'}}>{camY.toFixed(2)}</strong></div>
          <div style={{fontSize:12, opacity:0.9}}>Z <strong style={{float:'right'}}>{camZ.toFixed(2)}</strong></div>
          <div style={{fontSize:12, opacity:0.9}}>FOV <strong style={{float:'right'}}>{Math.round(fov)}</strong></div>
        </div>

        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <div style={{fontSize:12, opacity:0.9}}>Orbit controls</div>
          <div style={{marginLeft:'auto', fontSize:12, color:isScrolling ? '#fca5a5' : '#86efac'}}>{isScrolling ? 'Disabled' : 'Enabled'}</div>
        </div>
      </div>
    </section>
  );
};

export default Model;
