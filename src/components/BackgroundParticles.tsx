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

  // 극한 네온 파티클 생성
  const { geometry, originalPositions } = useMemo(() => {
    // 성능에 따른 파티클 수 조절 - 더 많은 파티클로
    const baseParticleCount = performanceLevel === 'high' ? 4000 : performanceLevel === 'medium' ? 2500 : 1500;
    const particleCount = Math.min(baseParticleCount + keyword.length * 100, baseParticleCount * 2.5);

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalPos = new Float32Array(particleCount * 3);

    // 강렬한 네온 색상 팔레트
    const neonPalette = [
      [1, 0, 1],         // 마젠타
      [0, 1, 1],         // 시안  
      [1, 1, 0],         // 옐로우
      [1, 0.1, 0.9],     // 핫핑크
      [0.1, 0.9, 1],     // 딥스카이
      [1, 0.5, 0],       // 오렌지
      [0.5, 0, 1],       // 바이올렛
      [0, 1, 0.3],       // 스프링그린
      [1, 0, 0.5],       // 딥핑크
      [0.3, 1, 0],       // 라임그린
      [0, 0.5, 1],       // 도저블루
      [1, 0.8, 0],       // 골드
    ];

    // 파티클 초기 위치와 색상 설정
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // 키워드 기반 분포 패턴 - 더 다양한 패턴
      const hash = keyword.charCodeAt(i % keyword.length) + i;
      const pattern = hash % 8;

      let x, y, z;

      switch (pattern) {
        case 0: // 구형 분포 - 더 넓은 범위
          const radius = 10 + Math.random() * 30;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          x = radius * Math.sin(phi) * Math.cos(theta);
          y = radius * Math.sin(phi) * Math.sin(theta);
          z = radius * Math.cos(phi);
          break;

        case 1: // 나선형 분포 - 더 복잡한 나선
          const angle = i * 0.3;
          const spiralRadius = 8 + i * 0.03;
          x = spiralRadius * Math.cos(angle) + Math.sin(angle * 3) * 3;
          y = (i - particleCount / 2) * 0.1;
          z = spiralRadius * Math.sin(angle) + Math.cos(angle * 2) * 3;
          break;

        case 2: // 클러스터 분포 - 더 많은 클러스터
          const clusterIndex = Math.floor(Math.random() * 8);
          const clusterCenters = [
            [12, 0, 0], [-12, 0, 0], [0, 12, 0], [0, -12, 0],
            [0, 0, 12], [0, 0, -12], [8, 8, 0], [-8, -8, 0]
          ];
          const center = clusterCenters[clusterIndex];
          x = center[0] + (Math.random() - 0.5) * 8;
          y = center[1] + (Math.random() - 0.5) * 8;
          z = center[2] + (Math.random() - 0.5) * 8;
          break;

        case 3: // 원환체(토러스) 분포
          const torusAngle = Math.random() * Math.PI * 2;
          const torusPhi = Math.random() * Math.PI * 2;
          const majorRadius = 12;
          const minorRadius = 4;
          x = (majorRadius + minorRadius * Math.cos(torusPhi)) * Math.cos(torusAngle);
          y = (majorRadius + minorRadius * Math.cos(torusPhi)) * Math.sin(torusAngle);
          z = minorRadius * Math.sin(torusPhi);
          break;

        case 4: // 카오스 분포 - 완전히 무작위
          x = (Math.random() - 0.5) * 40 + Math.sin(i * 0.1) * 8;
          y = (Math.random() - 0.5) * 40 + Math.cos(i * 0.1) * 8;
          z = (Math.random() - 0.5) * 25 + Math.sin(i * 0.05) * 5;
          break;

        case 5: // 프랙탈 분포
          const fractalLevel = 4;
          x = 0; y = 0; z = 0;
          for (let f = 0; f < fractalLevel; f++) {
            const scale = Math.pow(0.5, f);
            x += (Math.random() - 0.5) * 20 * scale;
            y += (Math.random() - 0.5) * 20 * scale;
            z += (Math.random() - 0.5) * 15 * scale;
          }
          break;

        case 6: // DNA 이중 나선
          const dnaAngle = i * 0.2;
          const dnaRadius = 6;
          const dnaHeight = (i - particleCount / 2) * 0.05;
          if (i % 2 === 0) {
            x = dnaRadius * Math.cos(dnaAngle);
            z = dnaRadius * Math.sin(dnaAngle);
          } else {
            x = dnaRadius * Math.cos(dnaAngle + Math.PI);
            z = dnaRadius * Math.sin(dnaAngle + Math.PI);
          }
          y = dnaHeight;
          break;

        case 7: // 파도형 분포
          const waveX = (i % 100) - 50;
          const waveZ = Math.floor(i / 100) - 50;
          x = waveX * 0.5;
          y = Math.sin(waveX * 0.3) * Math.cos(waveZ * 0.3) * 8;
          z = waveZ * 0.5;
          break;

        default:
          x = (Math.random() - 0.5) * 35;
          y = (Math.random() - 0.5) * 35;
          z = (Math.random() - 0.5) * 20;
      }

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // 원본 위치 저장
      originalPos[i3] = x;
      originalPos[i3 + 1] = y;
      originalPos[i3 + 2] = z;

      // 더 강렬한 네온 색상
      const colorIndex = (hash + i) % neonPalette.length;
      const [r, g, b] = neonPalette[colorIndex];
      const intensity = 0.8 + Math.random() * 0.2;
      colors[i3] = r * intensity;
      colors[i3 + 1] = g * intensity;
      colors[i3 + 2] = b * intensity;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return { geometry: geom, originalPositions: originalPos };
  }, [keyword, performanceLevel]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;

    // 극한 파티클 애니메이션
    for (let i = 0; i < positions.length; i += 3) {
      const originalX = originalPositions[i];
      const originalY = originalPositions[i + 1];
      const originalZ = originalPositions[i + 2];

      const particleIndex = i / 3;

      // 다중 웨이브 효과
      const wave1 = Math.sin(time * 2 + particleIndex * 0.01) * 1.5;
      const wave2 = Math.cos(time * 1.5 + particleIndex * 0.02) * 1.0;
      const wave3 = Math.sin(time * 3 + particleIndex * 0.005) * 0.5;

      // 난류 효과
      const turbulence = (Math.sin(originalX * 0.1 + time * 5) * Math.cos(originalY * 0.1 + time * 3)) * 2;

      // 극한 글리치 (15% 확률)
      if (Math.random() < 0.15) {
        positions[i] = originalX + (Math.random() - 0.5) * 15;
        positions[i + 1] = originalY + (Math.random() - 0.5) * 15;
        positions[i + 2] = originalZ + (Math.random() - 0.5) * 10;

        // 색상 극한 변화
        colors[i] = Math.random() * 2;
        colors[i + 1] = Math.random() * 2;
        colors[i + 2] = Math.random() * 2;
      } else {
        // 일반적인 움직임
        positions[i] = originalX + wave1 + turbulence * 0.3;
        positions[i + 1] = originalY + wave2 + turbulence * 0.5;
        positions[i + 2] = originalZ + wave3 + turbulence * 0.2;

        // 네온 펄스 효과
        const pulse = 1 + Math.sin(time * 4 + particleIndex * 0.1) * 0.4;
        colors[i] *= pulse;
        colors[i + 1] *= pulse;
        colors[i + 2] *= pulse;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    // 전체 파티클 시스템 회전
    pointsRef.current.rotation.x += 0.001;
    pointsRef.current.rotation.y += 0.002;
    pointsRef.current.rotation.z += 0.0005;

    // 전체 시스템 진동
    if (Math.random() < 0.05) {
      pointsRef.current.position.x = (Math.random() - 0.5) * 1;
      pointsRef.current.position.y = (Math.random() - 0.5) * 1;
      pointsRef.current.position.z = (Math.random() - 0.5) * 0.5;
    } else {
      pointsRef.current.position.x *= 0.98;
      pointsRef.current.position.y *= 0.98;
      pointsRef.current.position.z *= 0.98;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        vertexColors={true}
        transparent={true}
        opacity={0.7}
        size={performanceLevel === 'high' ? 3 : 2}
        sizeAttenuation={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default BackgroundParticles;
