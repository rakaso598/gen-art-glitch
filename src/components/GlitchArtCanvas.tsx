'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Scanline, Glitch } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import CreepyGlitchMesh from './CreepyGlitchMesh';
import CreepyBackgroundParticles from './CreepyBackgroundParticles';
import { isMobile, getPerformanceLevel } from '@/utils/performance';

interface GlitchArtCanvasProps {
  keyword: string;
}

const GlitchArtCanvas: React.FC<GlitchArtCanvasProps> = ({ keyword }) => {
  const [mobile, setMobile] = useState(false);
  const [performanceLevel, setPerformanceLevel] = useState('medium');
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [cameraShake, setCameraShake] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    setMobile(isMobile());
    setPerformanceLevel(getPerformanceLevel());
  }, []);

  // 카메라 흔들림 효과
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setCameraShake({
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2, 
          z: (Math.random() - 0.5) * 0.1
        });
        
        setTimeout(() => {
          setCameraShake({ x: 0, y: 0, z: 0 });
        }, 150);
      }
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen">
      <Canvas
        gl={{
          antialias: !mobile,
          alpha: false,
          powerPreference: "high-performance"
        }}
        dpr={mobile ? [1, 1.5] : [1, 2]}
      >
        <PerspectiveCamera 
          ref={cameraRef}
          makeDefault 
          position={[
            cameraShake.x, 
            cameraShake.y, 
            5 + cameraShake.z
          ]} 
        />

        {/* 섬뜩한 분위기를 위한 극도로 어두운 조명 */}
        <ambientLight intensity={0.01} color="#0A0A1A" />
        <pointLight position={[15, 15, 15]} intensity={0.03} color="#1A237E" />
        <pointLight position={[-15, -15, -15]} intensity={0.02} color="#311B92" />
        <pointLight position={[0, 20, 0]} intensity={0.02} color="#0A0A2A" />
        {!mobile && (
          <>
            <pointLight position={[10, -10, 5]} intensity={0.015} color="#2A0A2A" />
            <pointLight position={[-5, 5, -10]} intensity={0.015} color="#0A2A0A" />
            {/* 글리치 순간 번쩍이는 라이트 */}
            <pointLight position={[0, 0, 0]} intensity={Math.random() > 0.95 ? 0.5 : 0} color="#FF00FF" />
          </>
        )}

        {/* 배경 파티클 */}
        <CreepyBackgroundParticles keyword={keyword} />

        {/* 섬뜩한 글리치 엔티티 */}
        <CreepyGlitchMesh keyword={keyword} />

        {/* 카메라 컨트롤 - 불안정한 움직임 */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={Math.random() > 0.7}
          autoRotateSpeed={0.5 + Math.random() * 1.5}
          maxDistance={50}
          minDistance={0.1}
          panSpeed={1.5 + Math.random() * 0.5}
          rotateSpeed={1.2 + Math.random() * 0.3}
          zoomSpeed={1.0 + Math.random() * 0.2}
        />

        {/* 강화된 포스트 프로세싱 효과 */}
        {performanceLevel !== 'low' && (
          <EffectComposer>
            <Bloom
              intensity={0.08}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.7}
              blendFunction={BlendFunction.SCREEN}
            />
            <>
              {performanceLevel === 'high' && (
                <>
                  <Glitch
                    delay={new THREE.Vector2(1.5, 3.5)}
                    duration={new THREE.Vector2(0.1, 0.3)}
                    strength={new THREE.Vector2(0.1, 0.3)}
                    mode={GlitchMode.SPORADIC}
                    active
                    ratio={0.85}
                  />
                  <Scanline
                    blendFunction={BlendFunction.OVERLAY}
                    density={1.25}
                  />
                  <Noise
                    premultiply
                    blendFunction={BlendFunction.MULTIPLY}
                    opacity={0.4}
                  />
                </>
              )}
              {performanceLevel === 'medium' && (
                <>
                  <Scanline
                    blendFunction={BlendFunction.OVERLAY}
                    density={1.0}
                  />
                  <Noise
                    premultiply
                    blendFunction={BlendFunction.MULTIPLY}
                    opacity={0.25}
                  />
                </>
              )}
            </>
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default GlitchArtCanvas;
