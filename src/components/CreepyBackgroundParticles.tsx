'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPerformanceLevel } from '@/utils/performance';

interface BackgroundParticlesProps {
  keyword: string;
}

const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ keyword }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [performanceLevel] = useState(() => getPerformanceLevel());

  // 섬뜩한 파티클 생성
  const { geometry, originalPositions } = useMemo(() => {
    // 성능에 따른 파티클 수 조절 - 적은 수로 섬뜩함 강조
    const baseParticleCount = performanceLevel === 'high' ? 800 : performanceLevel === 'medium' ? 500 : 300;
    const particleCount = Math.min(baseParticleCount + keyword.length * 50, baseParticleCount * 1.5);

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalPos = new Float32Array(particleCount * 3);

    // 섬뜩한 색상 팔레트 - 매우 어둡고 불안정
    const creepyPalette = [
      [0.1, 0.14, 0.5],     // 짙은 남색 #1A237E
      [0.19, 0.11, 0.57],   // 검은 보라색 #311B92  
      [0.05, 0.05, 0.08],   // 매우 어두운 회색
      [0.1, 0.1, 0.15],     // 어둠
      [0.08, 0.05, 0.12],   // 자주빛 어둠
      [0.12, 0.08, 0.05],   // 갈색 어둠
      [0.05, 0.12, 0.08],   // 녹색 어둠
      [0.15, 0.05, 0.05],   // 적색 어둠
    ];

    // 파티클 초기 위치와 색상 설정 - 불안정한 분포
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // 키워드 기반 분포 패턴 - 클러스터와 빈 공간
      const hash = keyword.charCodeAt(i % keyword.length) + i;
      const distributionType = hash % 4;

      let x, y, z;

      switch (distributionType) {
        case 0: // 어둠의 클러스터
          const clusterAngle = (hash * 0.1) % (Math.PI * 2);
          const clusterRadius = 5 + Math.random() * 15;
          x = clusterRadius * Math.cos(clusterAngle) + (Math.random() - 0.5) * 5;
          y = clusterRadius * Math.sin(clusterAngle) + (Math.random() - 0.5) * 5;
          z = (Math.random() - 0.5) * 10;
          break;

        case 1: // 공허한 링
          const ringAngle = (i / particleCount) * Math.PI * 2;
          const ringRadius = 20 + Math.sin(hash * 0.05) * 8;
          x = ringRadius * Math.cos(ringAngle);
          y = ringRadius * Math.sin(ringAngle);
          z = (Math.random() - 0.5) * 4;
          break;

        case 2: // 산발적 흩어짐
          x = (Math.random() - 0.5) * 60;
          y = (Math.random() - 0.5) * 60;
          z = (Math.random() - 0.5) * 40;
          break;

        case 3: // 죽음의 나선
          const spiralAngle = i * 0.3;
          const spiralRadius = i * 0.1;
          x = spiralRadius * Math.cos(spiralAngle);
          y = spiralRadius * Math.sin(spiralAngle);
          z = (i - particleCount / 2) * 0.2;
          break;

        default:
          x = (Math.random() - 0.5) * 40;
          y = (Math.random() - 0.5) * 40;
          z = (Math.random() - 0.5) * 30;
      }

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPos[i3] = x;
      originalPos[i3 + 1] = y;
      originalPos[i3 + 2] = z;

      // 색상 할당 - 대부분 어둡고 가끔 번쩍임
      const colorIndex = (hash + i) % creepyPalette.length;
      const [r, g, b] = creepyPalette[colorIndex];
      
      // 일부 파티클만 글리치 색상으로
      const isGlitchParticle = Math.random() > 0.9;
      if (isGlitchParticle) {
        colors[i3] = 1;     // 마젠타 R
        colors[i3 + 1] = 0; // 마젠타 G
        colors[i3 + 2] = 1; // 마젠타 B
      } else {
        colors[i3] = r;
        colors[i3 + 1] = g;
        colors[i3 + 2] = b;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return { geometry: geo, originalPositions: originalPos };
  }, [keyword, performanceLevel]);

  // 섬뜩한 애니메이션
  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;

    // 파티클 애니메이션 - 불안정하고 끊어지는 움직임
    for (let i = 0; i < positions.length; i += 3) {
      const originalX = originalPositions[i];
      const originalY = originalPositions[i + 1];
      const originalZ = originalPositions[i + 2];

      // 글리치 효과 - 갑작스러운 순간이동
      if (Math.random() > 0.995) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 50;
      } else if (Math.random() > 0.98) {
        // 원래 위치로 복귀
        positions[i] = originalX + (Math.random() - 0.5) * 2;
        positions[i + 1] = originalY + (Math.random() - 0.5) * 2;
        positions[i + 2] = originalZ + (Math.random() - 0.5) * 2;
      } else {
        // 느린 드리프트
        positions[i] += Math.sin(time * 0.2 + i * 0.01) * 0.01;
        positions[i + 1] += Math.cos(time * 0.15 + i * 0.01) * 0.01;
        positions[i + 2] += Math.sin(time * 0.1 + i * 0.005) * 0.005;
      }

      // 색상 글리치
      if (Math.random() > 0.99) {
        colors[i] = Math.random() > 0.5 ? 1 : 0;     // R
        colors[i + 1] = 0;                           // G  
        colors[i + 2] = Math.random() > 0.5 ? 1 : 0; // B
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    // 전체 회전 - 느리고 불안정
    pointsRef.current.rotation.y += 0.0005 + Math.sin(time * 0.1) * 0.0002;
    pointsRef.current.rotation.x += 0.0003 + Math.cos(time * 0.08) * 0.0001;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        vertexColors
        size={0.8}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default BackgroundParticles;
