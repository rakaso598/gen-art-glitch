'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPerformanceLevel } from '@/utils/performance';

interface GlitchMeshProps {
  keyword: string;
}

// 궤적 기반 라인 아트 생성 함수
const createTrajectoryLines = (keyword: string, performanceLevel: string) => {
  const hash = keyword.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  // 성능에 따른 궤적 복잡도
  const trajectoryCount = performanceLevel === 'high' ? 15 : performanceLevel === 'medium' ? 10 : 6;
  const pointsPerTrajectory = performanceLevel === 'high' ? 80 : performanceLevel === 'medium' ? 50 : 30;

  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const colors: number[] = [];

  // 각 궤적마다 고유한 패턴 생성
  for (let t = 0; t < trajectoryCount; t++) {
    const trajectorySeed = hash + t * 100;

    // 궤적의 시작점과 방향 결정
    const startX = (random(trajectorySeed) - 0.5) * 4;
    const startY = (random(trajectorySeed + 1) - 0.5) * 4;
    const startZ = (random(trajectorySeed + 2) - 0.5) * 4;

    // 궤적의 기하학적 패턴 타입 결정
    const patternType = Math.floor(random(trajectorySeed + 3) * 5);

    // 네온 색상 결정 (궤적별로)
    const colorSeed = (trajectorySeed + hash) % 7;
    let r, g, b;
    switch (colorSeed) {
      case 0: r = 1; g = 0; b = 1; break;     // 마젠타
      case 1: r = 0; g = 1; b = 1; break;     // 시안
      case 2: r = 0.8; g = 1; b = 0; break;   // 라임
      case 3: r = 1; g = 0.2; b = 0.8; break; // 핫핑크
      case 4: r = 0.2; g = 0.8; b = 1; break; // 딥스카이
      case 5: r = 1; g = 0.5; b = 0; break;   // 오렌지
      case 6: r = 0.5; g = 0; b = 1; break;   // 바이올렛
      default: r = 1; g = 1; b = 1; break;    // 화이트
    }

    // 궤적 점들 생성
    for (let p = 0; p < pointsPerTrajectory; p++) {
      const progress = p / pointsPerTrajectory;
      const pointSeed = trajectorySeed + p * 0.1;

      let x, y, z;

      // 기하학적 궤적 패턴
      switch (patternType) {
        case 0: // 나선형 궤적
          const spiralRadius = 1 + progress * 3;
          const spiralAngle = progress * Math.PI * 6 + random(pointSeed) * 0.5;
          x = startX + spiralRadius * Math.cos(spiralAngle);
          y = startY + spiralRadius * Math.sin(spiralAngle);
          z = startZ + progress * 4 - 2;
          break;

        case 1: // 지그재그 궤적
          const zigzagAmp = 2;
          x = startX + progress * 6 - 3;
          y = startY + Math.sin(progress * Math.PI * 8) * zigzagAmp;
          z = startZ + Math.cos(progress * Math.PI * 4) * zigzagAmp * 0.5;
          break;

        case 2: // 웨이브 궤적
          const waveAmp = 1.5;
          x = startX + Math.sin(progress * Math.PI * 4) * waveAmp;
          y = startY + progress * 4 - 2;
          z = startZ + Math.cos(progress * Math.PI * 6) * waveAmp;
          break;

        case 3: // 프랙탈 궤적
          const fractalScale = 2;
          x = startX + Math.sin(progress * Math.PI * 12) * fractalScale * (1 - progress);
          y = startY + Math.cos(progress * Math.PI * 8) * fractalScale * (1 - progress);
          z = startZ + Math.sin(progress * Math.PI * 16) * fractalScale * 0.5;
          break;

        case 4: // 폭발형 궤적
          const explosionRadius = progress * progress * 5;
          const explosionAngle = random(pointSeed) * Math.PI * 2;
          x = startX + explosionRadius * Math.cos(explosionAngle);
          y = startY + explosionRadius * Math.sin(explosionAngle);
          z = startZ + (random(pointSeed + 1) - 0.5) * explosionRadius * 0.3;
          break;

        default:
          x = startX + (random(pointSeed) - 0.5) * 4;
          y = startY + (random(pointSeed + 1) - 0.5) * 4;
          z = startZ + (random(pointSeed + 2) - 0.5) * 4;
      }

      // 점 위치 추가
      vertices.push(x, y, z);

      // 색상 추가 (궤적 진행에 따라 강도 변화)
      const intensity = 0.3 + progress * 0.7;
      colors.push(r * intensity, g * intensity, b * intensity);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  return geometry;
};

// 키워드에 따른 색상 생성 함수
const createColorFromKeyword = (keyword: string, time: number) => {
  const hash = keyword.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  const neonColors = [
    new THREE.Color('#FF00FF'), // 마젠타
    new THREE.Color('#00FFFF'), // 시안
    new THREE.Color('#CCFF00'), // 라임 그린
    new THREE.Color('#FF0080'), // 핫 핑크
    new THREE.Color('#0080FF'), // 딥 스카이 블루
  ];

  const baseColorIndex = Math.abs(hash) % neonColors.length;
  const baseColor = neonColors[baseColorIndex];

  // 시간에 따른 색상 변화
  const timeOffset = time * 0.001;
  const colorShift = Math.sin(timeOffset + hash * 0.01) * 0.3;

  return new THREE.Color().copy(baseColor).multiplyScalar(1 + colorShift);
};

// 파격적인 Perlin noise 함수 (개선된 버전)
const improvedNoise = (x: number, y: number, z: number, time: number) => {
  // 여러 주파수의 노이즈를 결합하여 더 복잡한 패턴 생성
  const noise1 = (Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + time * 0.01) * 43758.5453) % 1;
  const noise2 = (Math.sin(x * 23.456 + y * 67.890 + z * 45.123 + time * 0.02) * 12345.6789) % 1;
  const noise3 = (Math.sin(x * 34.567 + y * 89.012 + z * 56.789 + time * 0.005) * 67890.1234) % 1;

  // 프랙탈 노이즈 (여러 옥타브 결합)
  return (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
};

// 극한 글리치 효과 함수
const extremeGlitch = (original: number, time: number, intensity: number, seed: number) => {
  const glitchChance = 0.05; // 5% 확률로 극한 글리치
  const randomValue = (Math.sin(seed + time * 0.01) * 43758.5453) % 1;

  if (Math.abs(randomValue) < glitchChance) {
    // 극한 변형: 원본에서 완전히 벗어남
    return original + (randomValue * intensity * 10);
  }

  return original;
};

const GlitchMesh: React.FC<GlitchMeshProps> = ({ keyword }) => {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const [performanceLevel] = useState(() => getPerformanceLevel());

  // 키워드 기반 궤적 라인 생성
  const geometry = useMemo(() => createTrajectoryLines(keyword, performanceLevel), [keyword, performanceLevel]);

  // 원본 정점 위치 저장
  const originalPositions = useMemo(() => {
    if (geometry.attributes.position) {
      return geometry.attributes.position.array.slice();
    }
    return new Float32Array();
  }, [geometry]);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime * 1000;
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;

    // 성능에 따른 업데이트 빈도 조절
    const updateFrequency = performanceLevel === 'high' ? 1 : performanceLevel === 'medium' ? 2 : 3;
    if (Math.floor(time / 16) % updateFrequency !== 0) return;

    // 궤적 라인 글리치 효과
    for (let i = 0; i < positions.length; i += 3) {
      const originalX = originalPositions[i];
      const originalY = originalPositions[i + 1];
      const originalZ = originalPositions[i + 2];

      // 궤적별 글리치 강도 (라인의 위치에 따라)
      const lineIndex = Math.floor(i / 3);
      const glitchSeed = lineIndex * 0.1 + time * 0.001;

      // 라인 특화 노이즈 (더 선형적이고 궤적다운)
      const noiseX = improvedNoise(originalX * 1.5, time * 0.002, lineIndex * 0.1, time) * 0.3;
      const noiseY = improvedNoise(originalY * 1.5, time * 0.003, lineIndex * 0.1, time) * 0.3;
      const noiseZ = improvedNoise(originalZ * 1.5, time * 0.001, lineIndex * 0.1, time) * 0.2;

      // 궤적 흐름 효과 (점들이 연결되어 흐르는 느낌)
      const flowEffect = Math.sin(time * 0.005 + lineIndex * 0.2) * 0.1;

      // 극한 글리치 (5% 확률로 궤적이 완전히 다른 곳으로)
      if (Math.random() < 0.05) {
        positions[i] = originalX + (Math.random() - 0.5) * 8;
        positions[i + 1] = originalY + (Math.random() - 0.5) * 8;
        positions[i + 2] = originalZ + (Math.random() - 0.5) * 4;

        // 색상도 극한 변화
        colors[i] = Math.random();
        colors[i + 1] = Math.random();
        colors[i + 2] = Math.random();
      } else {
        // 일반적인 궤적 변형
        positions[i] = originalX + noiseX + flowEffect;
        positions[i + 1] = originalY + noiseY + flowEffect * 0.5;
        positions[i + 2] = originalZ + noiseZ + flowEffect * 0.3;

        // 색상 강도 변화 (네온 효과)
        const intensity = 0.8 + Math.sin(time * 0.01 + lineIndex * 0.1) * 0.2;
        colors[i] *= intensity;
        colors[i + 1] *= intensity;
        colors[i + 2] *= intensity;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    // 전체 궤적 시스템 회전 (더 역동적으로)
    const rotationGlitch = Math.random() < 0.03;

    if (rotationGlitch) {
      meshRef.current.rotation.x += (Math.random() - 0.5) * 0.3;
      meshRef.current.rotation.y += (Math.random() - 0.5) * 0.3;
      meshRef.current.rotation.z += (Math.random() - 0.5) * 0.3;
    } else {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z += 0.001;
    }

    // 전체 시스템 진동과 이동
    const vibrationChance = performanceLevel === 'high' ? 0.08 : 0.04;
    if (Math.random() < vibrationChance) {
      const intensity = 1 + Math.random() * 2;
      meshRef.current.position.x = (Math.random() - 0.5) * intensity;
      meshRef.current.position.y = (Math.random() - 0.5) * intensity;
      meshRef.current.position.z = (Math.random() - 0.5) * intensity * 0.5;
    } else {
      // 중심으로 복귀
      meshRef.current.position.x *= 0.95;
      meshRef.current.position.y *= 0.95;
      meshRef.current.position.z *= 0.95;
    }
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        size={4}
        sizeAttenuation={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default GlitchMesh;
