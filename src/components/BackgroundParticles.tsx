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
    // 성능에 따른 파티클 수 조절 - 대폭 감소
    const baseParticleCount = performanceLevel === 'high' ? 200 : performanceLevel === 'medium' ? 100 : 50;
    const particleCount = Math.min(baseParticleCount + keyword.length * 10, baseParticleCount * 1.2);

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
      const pattern = hash % 12;

      let x, y, z;

      switch (pattern) {
        case 0: // 사건의 지평선 - 블랙홀 주변 분포
          const eventHorizonRadius = 20 + Math.random() * 60;
          const singularityPull = Math.random() * Math.PI * 2;
          const spacetimeCurvature = Math.random() * Math.PI;
          x = eventHorizonRadius * Math.sin(spacetimeCurvature) * Math.cos(singularityPull);
          y = eventHorizonRadius * Math.sin(spacetimeCurvature) * Math.sin(singularityPull);
          z = eventHorizonRadius * Math.cos(spacetimeCurvature);
          break;

        case 1: // 우주적 나선 - 은하계 구조
          const galacticAngle = i * 0.5;
          const galacticRadius = 15 + i * 0.05;
          const galacticArm = Math.sin(galacticAngle * 0.1) * 8;
          x = galacticRadius * Math.cos(galacticAngle) + galacticArm;
          y = (i - particleCount / 2) * 0.15;
          z = galacticRadius * Math.sin(galacticAngle) + galacticArm * 0.5;
          break;

        case 2: // 우주 보이드 - 거대한 공허 주변
          const voidIndex = Math.floor(Math.random() * 12);
          const voidCenters = [
            [25, 0, 0], [-25, 0, 0], [0, 25, 0], [0, -25, 0],
            [0, 0, 25], [0, 0, -25], [18, 18, 0], [-18, -18, 0],
            [18, 0, 18], [-18, 0, -18], [0, 18, 18], [0, -18, -18]
          ];
          const voidCenter = voidCenters[voidIndex];
          x = voidCenter[0] + (Math.random() - 0.5) * 15;
          y = voidCenter[1] + (Math.random() - 0.5) * 15;
          z = voidCenter[2] + (Math.random() - 0.5) * 15;
          break;

        case 3: // 차원 고리 - 고차원 토러스
          const dimensionalAngle = Math.random() * Math.PI * 2;
          const dimensionalPhi = Math.random() * Math.PI * 2;
          const cosmicRadius = 20;
          const dimensionalRadius = 8;
          x = (cosmicRadius + dimensionalRadius * Math.cos(dimensionalPhi)) * Math.cos(dimensionalAngle);
          y = (cosmicRadius + dimensionalRadius * Math.cos(dimensionalPhi)) * Math.sin(dimensionalAngle);
          z = dimensionalRadius * Math.sin(dimensionalPhi);
          break;

        case 4: // 양자 거품 - 양자 요동 분포
          const quantumScale = 80;
          x = (Math.random() - 0.5) * quantumScale + Math.sin(i * 0.05) * 15;
          y = (Math.random() - 0.5) * quantumScale + Math.cos(i * 0.05) * 15;
          z = (Math.random() - 0.5) * quantumScale * 0.6 + Math.sin(i * 0.02) * 8;
          break;

        case 5: // 무한 프랙탈 - 자기 유사성의 공포
          const infiniteLevels = 6;
          x = 0; y = 0; z = 0;
          for (let f = 0; f < infiniteLevels; f++) {
            const scale = Math.pow(0.6, f);
            const frequency = Math.pow(2, f);
            x += (Math.random() - 0.5) * 40 * scale * Math.sin(i * frequency * 0.01);
            y += (Math.random() - 0.5) * 40 * scale * Math.cos(i * frequency * 0.01);
            z += (Math.random() - 0.5) * 25 * scale * Math.sin(i * frequency * 0.005);
          }
          break;

        case 6: // 외계 DNA - 비정상적인 삼중 나선
          const alienDnaAngle = i * 0.4;
          const alienDnaRadius = 12;
          const alienHeight = (i - particleCount / 2) * 0.08;
          const geneticStrand = i % 3;
          const strandOffset = (geneticStrand * Math.PI * 2) / 3;
          x = alienDnaRadius * Math.cos(alienDnaAngle + strandOffset);
          z = alienDnaRadius * Math.sin(alienDnaAngle + strandOffset);
          y = alienHeight + Math.sin(alienDnaAngle * 3) * 3;
          break;

        case 7: // 시공간 파동 - 중력파 분포
          const gravitationalWaveX = (i % 150) - 75;
          const gravitationalWaveZ = Math.floor(i / 150) - 75;
          const waveAmplitude = 15;
          x = gravitationalWaveX * 0.8;
          y = Math.sin(gravitationalWaveX * 0.2) * Math.cos(gravitationalWaveZ * 0.2) * waveAmplitude;
          z = gravitationalWaveZ * 0.8;
          break;

        case 8: // 웜홀 네트워크 - 연결된 포털들
          const wormholeNodes = 8;
          const nodeIndex = i % wormholeNodes;
          const nodeAngle = (nodeIndex / wormholeNodes) * Math.PI * 2;
          const networkRadius = 30;
          const localRadius = 8;
          const nodeX = networkRadius * Math.cos(nodeAngle);
          const nodeY = networkRadius * Math.sin(nodeAngle);
          x = nodeX + (Math.random() - 0.5) * localRadius;
          y = nodeY + (Math.random() - 0.5) * localRadius;
          z = (Math.random() - 0.5) * localRadius;
          break;

        case 9: // 양자 얽힘 클러스터 - 상호연결된 입자들
          const entanglementPairs = Math.floor(particleCount / 2);
          const pairIndex = i % entanglementPairs;
          const entanglementAngle = (pairIndex / entanglementPairs) * Math.PI * 2;
          const entanglementRadius = 25;
          const isFirstParticle = i < entanglementPairs;
          x = entanglementRadius * Math.cos(entanglementAngle) * (isFirstParticle ? 1 : -1);
          y = entanglementRadius * Math.sin(entanglementAngle) * (isFirstParticle ? 1 : -1);
          z = (Math.random() - 0.5) * 10;
          break;

        case 10: // 다크 에너지 필라멘트 - 우주 거대구조
          const filamentLength = 60;
          const filamentThickness = 5;
          const filamentProgress = (i / particleCount) * filamentLength - filamentLength / 2;
          const filamentRadius = Math.sin(filamentProgress * 0.1) * filamentThickness;
          x = filamentProgress;
          y = filamentRadius * Math.cos(i * 0.5);
          z = filamentRadius * Math.sin(i * 0.5);
          break;

        case 11: // 멀티버스 막 - 평행우주 경계
          const membraneSize = 50;
          const membraneThickness = 3;
          x = (Math.random() - 0.5) * membraneSize;
          y = (Math.random() - 0.5) * membraneSize;
          z = (Math.random() - 0.5) * membraneThickness + Math.sin(x * 0.2 + y * 0.2) * 8;
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

      // 극도로 어두운 색상
      const colorIndex = (hash + i) % creepyPalette.length;
      const [r, g, b] = creepyPalette[colorIndex];
      const intensity = 0.08 + Math.random() * 0.08;
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

      // 기하학적 글리치 (8% 확률로 줄임)
      if (Math.random() < 0.08) {
        positions[i] = originalX + (Math.random() - 0.5) * 15;
        positions[i + 1] = originalY + (Math.random() - 0.5) * 15;
        positions[i + 2] = originalZ + (Math.random() - 0.5) * 10;

        // 색상 절제된 변화
        colors[i] = Math.random() * 0.3;
        colors[i + 1] = Math.random() * 0.3;
        colors[i + 2] = Math.random() * 0.3;
      } else {
        // 일반적인 움직임
        positions[i] = originalX + wave1 + turbulence * 0.3;
        positions[i + 1] = originalY + wave2 + turbulence * 0.5;
        positions[i + 2] = originalZ + wave3 + turbulence * 0.2;

        // 어둠의 펄스 효과 - 절제된
        const pulse = 0.6 + Math.sin(time * 4 + particleIndex * 0.1) * 0.2;
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
        opacity={0.15}
        size={performanceLevel === 'high' ? 1.5 : 1}
        sizeAttenuation={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};

export default BackgroundParticles;
