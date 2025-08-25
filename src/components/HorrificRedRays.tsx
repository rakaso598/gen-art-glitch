'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPerformanceLevel } from '@/utils/performance';

interface HorrificRedRaysProps {
  keyword: string;
}

// 끔찍한 빨간색 기하학적 광선 생성
const createHorrificRedRays = (keyword: string, performanceLevel: string) => {
  const hash = keyword.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 성능에 따른 광선 수량 조절
  const rayCount = performanceLevel === 'high' ? 80 : performanceLevel === 'medium' ? 50 : 30;

  const vertices: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i < rayCount; i++) {
    const raySeed = hash + i * 100;

    // 중심점에서 시작
    const centerX = (random(raySeed) - 0.5) * 0.5;
    const centerY = (random(raySeed + 1) - 0.5) * 0.5;
    const centerZ = (random(raySeed + 2) - 0.5) * 0.5;

    // 광선의 방향 (완전히 불규칙하고 비대칭적)
    const angle = random(raySeed + 3) * Math.PI * 2;
    const elevation = (random(raySeed + 4) - 0.5) * Math.PI;

    // 광선의 길이 (매우 불규칙)
    const baseLength = 15 + random(raySeed + 5) * 20;

    // 여러 개의 연결된 선분으로 끔찍하고 날카로운 광선 생성
    const segmentCount = Math.floor(3 + random(raySeed + 6) * 8);
    let currentX = centerX;
    let currentY = centerY;
    let currentZ = centerZ;

    for (let j = 0; j < segmentCount; j++) {
      const segmentSeed = raySeed + j * 10;

      // 다음 점 계산 (급작스러운 방향 변화)
      const segmentLength = (baseLength / segmentCount) * (0.5 + random(segmentSeed) * 1.5);
      const directionNoise = (random(segmentSeed + 1) - 0.5) * 2; // 급격한 방향 변화
      const elevationNoise = (random(segmentSeed + 2) - 0.5) * 1.5;

      const nextX = currentX + Math.cos(angle + directionNoise) * Math.cos(elevation + elevationNoise) * segmentLength;
      const nextY = currentY + Math.sin(elevation + elevationNoise) * segmentLength;
      const nextZ = currentZ + Math.sin(angle + directionNoise) * Math.cos(elevation + elevationNoise) * segmentLength;

      // 선분의 시작점
      vertices.push(currentX, currentY, currentZ);
      // 선분의 끝점
      vertices.push(nextX, nextY, nextZ);

      // 끔찍한 빨간색 계열 색상
      const redIntensity = 0.6 + random(segmentSeed + 3) * 0.4; // 0.6 ~ 1.0
      const greenIntensity = 0.0 + random(segmentSeed + 4) * 0.1; // 0.0 ~ 0.1 (거의 없음)
      const blueIntensity = 0.0 + random(segmentSeed + 5) * 0.05; // 0.0 ~ 0.05 (거의 없음)

      // 시작점 색상 (어두운 빨강)
      colors.push(redIntensity * 0.5, greenIntensity * 0.5, blueIntensity * 0.5);
      // 끝점 색상 (밝은 빨강 - 글로우 효과)
      colors.push(redIntensity, greenIntensity, blueIntensity);

      // 선분 인덱스
      const vertexIndex = (i * segmentCount + j) * 2;
      indices.push(vertexIndex, vertexIndex + 1);

      // 다음 선분을 위해 현재 위치 업데이트
      currentX = nextX;
      currentY = nextY;
      currentZ = nextZ;
    }
  }

  // 추가적인 끔찍한 파편들 (공중에 떠다니는 빨간 조각들)
  const fragmentCount = Math.floor(rayCount * 0.3);
  for (let f = 0; f < fragmentCount; f++) {
    const fragmentSeed = hash + f * 200;

    // 파편 위치
    const x = (random(fragmentSeed) - 0.5) * 30;
    const y = (random(fragmentSeed + 1) - 0.5) * 30;
    const z = (random(fragmentSeed + 2) - 0.5) * 15;

    // 작은 날카로운 조각들
    const size = 0.1 + random(fragmentSeed + 3) * 0.3;

    // 삼각형 파편
    vertices.push(
      x, y, z,
      x + size, y, z,
      x, y + size, z
    );

    // 강렬한 빨간색
    const intensity = 0.8 + random(fragmentSeed + 4) * 0.2;
    colors.push(
      intensity, 0, 0,
      intensity, 0, 0,
      intensity, 0, 0
    );

    // 파편 인덱스
    const fragmentIndex = vertices.length / 3 - 3;
    indices.push(fragmentIndex, fragmentIndex + 1, fragmentIndex + 2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
  geometry.setIndex(indices);

  return geometry;
};

const HorrificRedRays: React.FC<HorrificRedRaysProps> = ({ keyword }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const performanceLevel = getPerformanceLevel();

  // 기하학적 광선 지오메트리 생성
  const geometry = useMemo(() =>
    createHorrificRedRays(keyword, performanceLevel), [keyword, performanceLevel]
  );

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime;
    const mesh = meshRef.current;

    // 끔찍한 펄스 효과
    const pulseIntensity = 0.5 + Math.sin(time * 3) * 0.3 + Math.sin(time * 7) * 0.2;

    // 머티리얼 emissive 강도 조절
    materialRef.current.emissive.setRGB(
      pulseIntensity * 0.8, // 빨강
      pulseIntensity * 0.1, // 초록 (거의 없음)
      0 // 파랑 (없음)
    );

    // 불안정한 회전
    mesh.rotation.x += 0.001 + Math.sin(time * 0.7) * 0.002;
    mesh.rotation.y += 0.002 + Math.cos(time * 0.5) * 0.001;
    mesh.rotation.z += 0.0005 + Math.sin(time * 1.1) * 0.001;

    // 갑작스러운 글리치 효과
    if (Math.random() > 0.98) {
      mesh.scale.set(
        1 + (Math.random() - 0.5) * 0.1,
        1 + (Math.random() - 0.5) * 0.1,
        1 + (Math.random() - 0.5) * 0.1
      );

      setTimeout(() => {
        if (meshRef.current) {
          meshRef.current.scale.set(1, 1, 1);
        }
      }, 50);
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        ref={materialRef}
        vertexColors
        transparent
        opacity={0.9}
        emissive="#660000"
        roughness={0.1}
        metalness={0.8}
        blending={THREE.AdditiveBlending} // 글로우 효과
      />
    </mesh>
  );
};

export default HorrificRedRays;
