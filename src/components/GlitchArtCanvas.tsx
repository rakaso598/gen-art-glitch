'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useState, useEffect } from 'react';
import TrajectoryLines from './TrajectoryLines';
import BackgroundParticles from './BackgroundParticles';
import { isMobile, getPerformanceLevel } from '@/utils/performance';

interface GlitchArtCanvasProps {
  keyword: string;
}

const GlitchArtCanvas: React.FC<GlitchArtCanvasProps> = ({ keyword }) => {
  const [mobile, setMobile] = useState(false);
  const [performanceLevel, setPerformanceLevel] = useState('medium');

  useEffect(() => {
    setMobile(isMobile());
    setPerformanceLevel(getPerformanceLevel());
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
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />

        {/* 기하학적 섬뜩함을 위한 극도로 어두운 조명 */}
        <ambientLight intensity={0.02} />
        <pointLight position={[15, 15, 15]} intensity={0.08} color="#0A0A1A" />
        <pointLight position={[-15, -15, -15]} intensity={0.06} color="#1A0A1A" />
        <pointLight position={[0, 20, 0]} intensity={0.05} color="#0A1A0A" />
        {!mobile && (
          <>
            <pointLight position={[10, -10, 5]} intensity={0.04} color="#1A1A0A" />
            <pointLight position={[-5, 5, -10]} intensity={0.04} color="#0A0A2A" />
          </>
        )}

        {/* 배경 파티클 */}
        <BackgroundParticles keyword={keyword} />

        {/* 궤적 라인 글리치 아트 */}
        <TrajectoryLines keyword={keyword} />

        {/* 자유로운 카메라 컨트롤 */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          autoRotateSpeed={0}
          maxDistance={50}
          minDistance={0.1}
          panSpeed={1.5}
          rotateSpeed={1.2}
          zoomSpeed={1.0}
        />

        {/* 기하학적 섬뜩함을 위한 절제된 포스트 프로세싱 효과 */}
        {performanceLevel !== 'low' && (
          <EffectComposer>
            <Bloom
              intensity={0.3}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.8}
              blendFunction={BlendFunction.SCREEN}
            />
            <>
              {performanceLevel === 'high' && (
                <Noise
                  premultiply
                  blendFunction={BlendFunction.MULTIPLY}
                  opacity={0.25}
                />
              )}
            </>
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default GlitchArtCanvas;
