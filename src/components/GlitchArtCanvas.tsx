'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Scanline, Glitch } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import CreepyGlitchMesh from './CreepyGlitchMesh';
import CreepyBackgroundParticles from './CreepyBackgroundParticles';
import HorrificRedRays from './HorrificRedRays';
import JumpscareFlash from './JumpscareFlash';
import { isMobile, getPerformanceLevel } from '@/utils/performance';

interface GlitchArtCanvasProps {
  keyword: string;
}

const GlitchArtCanvas: React.FC<GlitchArtCanvasProps> = ({ keyword }) => {
  const [mobile, setMobile] = useState(false);
  const [performanceLevel, setPerformanceLevel] = useState('medium');
  const [canvasReady, setCanvasReady] = useState(false);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [cameraShake, setCameraShake] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    setMobile(isMobile());
    setPerformanceLevel(getPerformanceLevel());
  }, []);

  useEffect(() => {
    setMobile(isMobile());
    setPerformanceLevel(getPerformanceLevel());
  }, []);

  // 카메라 흔들림 효과 (자동 카메라 조작은 제거하고 시각적 효과만)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setCameraShake({
          x: (Math.random() - 0.5) * 0.1,
          y: (Math.random() - 0.5) * 0.1,
          z: (Math.random() - 0.5) * 0.05
        });

        setTimeout(() => {
          setCameraShake({ x: 0, y: 0, z: 0 });
        }, 100);
      }
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen">
      <Canvas
        gl={{
          antialias: performanceLevel === 'high' && !mobile, // 조건부 안티앨리어싱
          powerPreference: "high-performance",
          alpha: false, // 투명도 비활성화로 성능 향상
          depth: true,
          stencil: false // 스텐실 버퍼 비활성화
        }}
        dpr={mobile ? 1 : (performanceLevel === 'high' ? 1.5 : 1)} // DPR 최적화
        camera={{ position: [0, 0, 5], fov: 75 }}
        onCreated={(state) => {
          // WebGL 컨텍스트 안전 설정
          if (state?.gl) {
            try {
              state.gl.setClearColor(0x050505, 1.0);
              setCanvasReady(true);
            } catch (error) {
              console.warn('WebGL setup warning:', error);
              setCanvasReady(true);
            }
          }
        }}
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
        {/* 끔찍한 빨간 조명 효과 */}
        <pointLight position={[0, 0, 0]} intensity={0.3} color="#990000" />
        <pointLight position={[10, 0, 0]} intensity={0.2} color="#660000" />
        <pointLight position={[-10, 0, 0]} intensity={0.2} color="#CC0000" />
        {!mobile && (
          <>
            <pointLight position={[10, -10, 5]} intensity={0.015} color="#2A0A2A" />
            <pointLight position={[-5, 5, -10]} intensity={0.015} color="#0A2A0A" />
            {/* 글리치 순간 번쩍이는 빨간 라이트 */}
            <pointLight position={[0, 0, 0]} intensity={Math.random() > 0.95 ? 1.0 : 0} color="#FF0000" />
            <pointLight position={[5, 5, 5]} intensity={Math.random() > 0.98 ? 0.8 : 0} color="#990000" />
          </>
        )}

        {/* 배경 파티클 */}
        {canvasReady && <CreepyBackgroundParticles keyword={keyword} />}

        {/* 끔찍한 빨간 기하학적 광선 */}
        {canvasReady && <HorrificRedRays keyword={keyword} />}

        {/* 섬뜩한 글리치 엔티티 */}
        {canvasReady && <CreepyGlitchMesh keyword={keyword} />}

        {/* 갑작스러운 점프케어 효과 (고성능에서만) */}
        {canvasReady && performanceLevel === 'high' && <JumpscareFlash keyword={keyword} />}

        {/* 카메라 컨트롤 - 사용자 전용 제어 */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          maxDistance={50}
          minDistance={0.1}
          panSpeed={1.0}
          rotateSpeed={1.0}
          zoomSpeed={1.0}
          dampingFactor={0.1}
          enableDamping={true}
        />

        {/* 최적화된 포스트 프로세싱 효과 */}
        {performanceLevel === 'high' && (
          <EffectComposer>
            <Bloom
              intensity={0.05}
              luminanceThreshold={0.95}
              luminanceSmoothing={0.5}
              blendFunction={BlendFunction.SCREEN}
            />
            <Noise
              premultiply
              blendFunction={BlendFunction.MULTIPLY}
              opacity={0.2}
            />
          </EffectComposer>
        )}
        {performanceLevel === 'medium' && (
          <EffectComposer>
            <Bloom
              intensity={0.03}
              luminanceThreshold={0.98}
              luminanceSmoothing={0.3}
              blendFunction={BlendFunction.SCREEN}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default GlitchArtCanvas;
