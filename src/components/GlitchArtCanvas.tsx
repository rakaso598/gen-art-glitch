'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import CreepyGlitchMesh from './CreepyGlitchMesh';
import CreepyBackgroundParticles from './CreepyBackgroundParticles';
import HorrificRedRays from './HorrificRedRays';
import JumpscareFlash from './JumpscareFlash';
import TerrorFlash from './TerrorFlash';
import PerformanceMonitor from './PerformanceMonitor';
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
  const shakeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [emergencyMode, setEmergencyMode] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
    setPerformanceLevel(getPerformanceLevel());
  }, []);

  // 성능 문제 감지시 긴급 모드 활성화
  const handlePerformanceIssue = () => {
    console.log('Activating emergency performance mode');
    setEmergencyMode(true);
    setPerformanceLevel('low');

    // 5분 후 긴급 모드 해제
    setTimeout(() => {
      setEmergencyMode(false);
      setPerformanceLevel(getPerformanceLevel());
    }, 300000);
  };

  // 카메라 흔들림 효과 (메모리 누수 방지)
  useEffect(() => {
    if (shakeIntervalRef.current) {
      clearInterval(shakeIntervalRef.current);
    }

    shakeIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.85) { // 더 자주 흔들림
        setCameraShake({
          x: (Math.random() - 0.5) * 0.15,
          y: (Math.random() - 0.5) * 0.15,
          z: (Math.random() - 0.5) * 0.08
        });

        setTimeout(() => {
          setCameraShake({ x: 0, y: 0, z: 0 });
        }, 150);
      }
    }, 2000 + Math.random() * 1500);

    return () => {
      if (shakeIntervalRef.current) {
        clearInterval(shakeIntervalRef.current);
      }
    };
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (shakeIntervalRef.current) {
        clearInterval(shakeIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-screen">
      <Canvas
        gl={{
          antialias: performanceLevel === 'high' && !mobile, // 조건부 안티앨리어싱
          powerPreference: "high-performance",
          alpha: false, // 투명도 비활성화로 성능 향상
          depth: true,
          stencil: false, // 스텐실 버퍼 비활성화
          preserveDrawingBuffer: false, // 드로잉 버퍼 보존 비활성화
          failIfMajorPerformanceCaveat: false // 성능 문제 시에도 계속 실행
        }}
        dpr={mobile ? 1 : (performanceLevel === 'high' ? 1.5 : 1)} // DPR 최적화
        camera={{ position: [0, 0, 5], fov: 75 }}
        frameloop="always" // 지속적인 렌더링
        onCreated={(state) => {
          // WebGL 컨텍스트 안전 설정
          if (state?.gl) {
            try {
              state.gl.setClearColor(0x050505, 1.0);
              // 메모리 관리 설정
              state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
        <ambientLight intensity={0.005} color="#0A0A1A" />
        <pointLight position={[15, 15, 15]} intensity={0.02} color="#1A237E" />
        <pointLight position={[-15, -15, -15]} intensity={0.015} color="#311B92" />
        <pointLight position={[0, 20, 0]} intensity={0.01} color="#0A0A2A" />

        {/* 끔찍한 빨간 조명 효과 - 더 강렬하고 무서운 느낌 */}
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#990000" />
        <pointLight position={[10, 0, 0]} intensity={0.3} color="#660000" />
        <pointLight position={[-10, 0, 0]} intensity={0.3} color="#CC0000" />
        <pointLight position={[0, -10, 0]} intensity={0.4} color="#AA0000" />
        <pointLight position={[0, 10, 0]} intensity={0.2} color="#FF0000" />

        {/* 무작위로 번쩍이는 공포 조명 */}
        <pointLight
          position={[Math.sin(Date.now() * 0.001) * 10, 0, Math.cos(Date.now() * 0.001) * 10]}
          intensity={Math.random() > 0.92 ? 1.5 : 0}
          color="#FF0000"
        />
        <pointLight
          position={[0, Math.sin(Date.now() * 0.002) * 15, 0]}
          intensity={Math.random() > 0.95 ? 1.0 : 0}
          color="#FF4444"
        />

        {!mobile && (
          <>
            <pointLight position={[10, -10, 5]} intensity={0.01} color="#2A0A2A" />
            <pointLight position={[-5, 5, -10]} intensity={0.01} color="#0A2A0A" />
            {/* 더 강렬한 글리치 순간 번쩍이는 빨간 라이트 */}
            <pointLight position={[0, 0, 0]} intensity={Math.random() > 0.9 ? 2.0 : 0} color="#FF0000" />
            <pointLight position={[5, 5, 5]} intensity={Math.random() > 0.93 ? 1.5 : 0} color="#990000" />
            <pointLight position={[-5, -5, -5]} intensity={Math.random() > 0.94 ? 1.2 : 0} color="#CC0000" />

            {/* 추가 공포 조명 */}
            <pointLight position={[0, 0, -20]} intensity={Math.random() > 0.96 ? 0.8 : 0} color="#FF0066" />
            <pointLight position={[20, 0, 0]} intensity={Math.random() > 0.97 ? 0.6 : 0} color="#660000" />
          </>
        )}

        {/* 배경 파티클 */}
        {canvasReady && <CreepyBackgroundParticles keyword={keyword} />}

        {/* 끔찍한 빨간 기하학적 광선 */}
        {canvasReady && <HorrificRedRays keyword={keyword} />}

        {/* 섬뜩한 글리치 엔티티 */}
        {canvasReady && <CreepyGlitchMesh keyword={keyword} />}

        {/* 갑작스러운 점프케어 효과 (고성능에서만, 긴급모드 아닐때만) */}
        {canvasReady && performanceLevel === 'high' && !emergencyMode && <JumpscareFlash keyword={keyword} />}

        {/* 새로운 공포 플래시 효과 */}
        {canvasReady && !emergencyMode && <TerrorFlash keyword={keyword} />}

        {/* 성능 모니터링 */}
        <PerformanceMonitor onPerformanceIssue={handlePerformanceIssue} />

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
