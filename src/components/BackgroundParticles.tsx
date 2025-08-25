'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPerformanceLevel } from '@/utils/performance';

interface BackgroundParticlesProps {
  keyword: string;
}

const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ keyword }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [performanceLevel] = useState(() => getPerformanceLevel());
  
  // 성능에 따른 파티클 수 조절
  const baseParticleCount = performanceLevel === 'high' ? 2000 : performanceLevel === 'medium' ? 1000 : 500;
  const particleCount = Math.min(baseParticleCount + keyword.length * 20, baseParticleCount * 1.5);
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  // 파티클 초기 위치와 색상 설정
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // 랜덤 위치
    positions[i3] = (Math.random() - 0.5) * 20;
    positions[i3 + 1] = (Math.random() - 0.5) * 20;
    positions[i3 + 2] = (Math.random() - 0.5) * 20;
    
    // 네온 색상
    const colorType = Math.floor(Math.random() * 3);
    switch (colorType) {
      case 0:
        colors[i3] = 1; colors[i3 + 1] = 0; colors[i3 + 2] = 1; // 마젠타
        break;
      case 1:
        colors[i3] = 0; colors[i3 + 1] = 1; colors[i3 + 2] = 1; // 시안
        break;
      case 2:
        colors[i3] = 0.8; colors[i3 + 1] = 1; colors[i3 + 2] = 0; // 라임
        break;
    }
  }
  
  useFrame(() => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // 글리치 효과로 파티클 움직임
      if (Math.random() < 0.01) { // 1% 확률로 글리치 점프
        positions[i3] += (Math.random() - 0.5) * 2;
        positions[i3 + 1] += (Math.random() - 0.5) * 2;
        positions[i3 + 2] += (Math.random() - 0.5) * 2;
      }
      
      // 경계 체크 및 리셋
      if (Math.abs(positions[i3]) > 10) positions[i3] = (Math.random() - 0.5) * 20;
      if (Math.abs(positions[i3 + 1]) > 10) positions[i3 + 1] = (Math.random() - 0.5) * 20;
      if (Math.abs(positions[i3 + 2]) > 10) positions[i3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y += 0.001;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation={false}
        vertexColors={true}
        transparent={true}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default BackgroundParticles;
