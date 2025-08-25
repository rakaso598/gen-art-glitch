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

        {/* 우주적 섬뜩함을 위한 어둠 조명 */}
        <ambientLight intensity={0.05} />
        <pointLight position={[15, 15, 15]} intensity={0.3} color="#0A0A2E" />
        <pointLight position={[-15, -15, -15]} intensity={0.2} color="#16213E" />
        <pointLight position={[0, 20, 0]} intensity={0.15} color="#1A1A40" />
        {!mobile && (
          <>
            <pointLight position={[10, -10, 5]} intensity={0.1} color="#0F0F23" />
            <pointLight position={[-5, 5, -10]} intensity={0.1} color="#0E1B55" />
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

        {/* 우주적 섬뜩함을 위한 포스트 프로세싱 효과 */}
        {performanceLevel !== 'low' && (
          <EffectComposer>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.1}
              luminanceSmoothing={0.3}
              blendFunction={BlendFunction.SCREEN}
            />
            <>
              {performanceLevel === 'high' && (
                <Noise
                  premultiply
                  blendFunction={BlendFunction.MULTIPLY}
                  opacity={0.15}
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
