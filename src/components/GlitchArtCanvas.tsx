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

        {/* 조명 설정 - 모바일에서는 간소화 */}
        <ambientLight intensity={mobile ? 0.4 : 0.3} />
        <pointLight position={[10, 10, 10]} intensity={mobile ? 0.7 : 1} color="#FF00FF" />
        {!mobile && (
          <>
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00FFFF" />
            <pointLight position={[5, -5, 5]} intensity={0.7} color="#CCFF00" />
          </>
        )}

        {/* 배경 파티클 */}
        <BackgroundParticles keyword={keyword} />

        {/* 궤적 라인 글리치 아트 */}
        <TrajectoryLines keyword={keyword} />

        {/* 카메라 컨트롤 */}
        <OrbitControls
          enablePan={false}
          enableZoom={!mobile}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={mobile ? 0.3 : 0.5}
          maxDistance={10}
          minDistance={2}
        />

        {/* 포스트 프로세싱 효과 - 성능에 따라 조절 */}
        {performanceLevel !== 'low' && (
          <EffectComposer>
            <Bloom
              intensity={mobile ? 1.0 : 1.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              blendFunction={BlendFunction.ADD}
            />
            <>
              {performanceLevel === 'high' && (
                <Noise
                  premultiply
                  blendFunction={BlendFunction.ADD}
                  opacity={0.1}
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
