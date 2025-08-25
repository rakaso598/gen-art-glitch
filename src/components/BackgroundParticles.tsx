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
  
  // 파티클 초기 위치와 색상 설정 (더 불규칙하게)
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // 키워드 기반 분포 패턴
    const hash = keyword.charCodeAt(i % keyword.length) + i;
    const pattern = hash % 3;
    
    let x, y, z;
    
    switch (pattern) {
      case 0: // 구형 분포
        const radius = 5 + Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
        break;
      case 1: // 나선형 분포
        const angle = i * 0.1;
        const spiralRadius = 3 + i * 0.01;
        x = spiralRadius * Math.cos(angle);
        y = (i - particleCount / 2) * 0.05;
        z = spiralRadius * Math.sin(angle);
        break;
      case 2: // 클러스터 분포
        const clusterCenter = [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10];
        x = clusterCenter[0] + (Math.random() - 0.5) * 4;
        y = clusterCenter[1] + (Math.random() - 0.5) * 4;
        z = clusterCenter[2] + (Math.random() - 0.5) * 4;
        break;
      default:
        x = (Math.random() - 0.5) * 20;
        y = (Math.random() - 0.5) * 20;
        z = (Math.random() - 0.5) * 20;
    }
    
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    
    // 더 다양하고 파격적인 네온 색상
    const colorType = (hash + i) % 7;
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
      case 3:
        colors[i3] = 1; colors[i3 + 1] = 0.2; colors[i3 + 2] = 0.8; // 핫 핑크
        break;
      case 4:
        colors[i3] = 0.2; colors[i3 + 1] = 0.8; colors[i3 + 2] = 1; // 딥 스카이
        break;
      case 5:
        colors[i3] = 1; colors[i3 + 1] = 0.5; colors[i3 + 2] = 0; // 오렌지
        break;
      case 6:
        colors[i3] = 0.5; colors[i3 + 1] = 0; colors[i3 + 2] = 1; // 바이올렛
        break;
    }
  }
  
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const colors = pointsRef.current.geometry.attributes.color.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // 더 복잡하고 파격적인 움직임 패턴
      const seed = i * 0.1;
      
      // 1. 파도형 움직임
      const waveX = Math.sin(time * 0.5 + seed) * 0.02;
      const waveY = Math.cos(time * 0.3 + seed * 1.5) * 0.02;
      const waveZ = Math.sin(time * 0.7 + seed * 0.5) * 0.01;
      
      // 2. 극한 글리치 점프 (10% 확률)
      if (Math.random() < 0.1) {
        positions[i3] += (Math.random() - 0.5) * 5;
        positions[i3 + 1] += (Math.random() - 0.5) * 5;
        positions[i3 + 2] += (Math.random() - 0.5) * 3;
      } else {
        // 일반적인 움직임
        positions[i3] += waveX;
        positions[i3 + 1] += waveY;
        positions[i3 + 2] += waveZ;
      }
      
      // 3. 색상 글리치 (5% 확률로 색상 급변)
      if (Math.random() < 0.05) {
        colors[i3] = Math.random();
        colors[i3 + 1] = Math.random();
        colors[i3 + 2] = Math.random();
      }
      
      // 4. 경계 체크 및 리셋 (더 넓은 범위)
      const maxDistance = 25;
      if (Math.abs(positions[i3]) > maxDistance) {
        positions[i3] = (Math.random() - 0.5) * maxDistance;
      }
      if (Math.abs(positions[i3 + 1]) > maxDistance) {
        positions[i3 + 1] = (Math.random() - 0.5) * maxDistance;
      }
      if (Math.abs(positions[i3 + 2]) > maxDistance) {
        positions[i3 + 2] = (Math.random() - 0.5) * maxDistance;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
    
    // 전체 파티클 시스템 회전
    pointsRef.current.rotation.y += 0.002;
    pointsRef.current.rotation.x += 0.001;
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
