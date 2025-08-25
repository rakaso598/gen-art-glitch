'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPerformanceLevel } from '@/utils/performance';

interface GlitchMeshProps {
  keyword: string;
}

// 파격적인 generative art 형태 생성 함수
const createGenerativeArt = (keyword: string, performanceLevel: string) => {
  const hash = keyword.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // 성능에 따른 복잡도 조절
  const complexity = performanceLevel === 'high' ? 200 : performanceLevel === 'medium' ? 120 : 80;
  
  // 완전히 불규칙한 형태 생성을 위한 랜덤 시드
  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];
  
  // 키워드 기반 불규칙 점들 생성
  for (let i = 0; i < complexity; i++) {
    const seed1 = hash + i * 0.1;
    const seed2 = hash + i * 0.2;
    const seed3 = hash + i * 0.3;
    
    // 구면 좌표계를 변형한 불규칙 분포
    const radius = 1 + random(seed1) * 2;
    const theta = random(seed2) * Math.PI * 2;
    const phi = random(seed3) * Math.PI;
    
    // 불규칙한 변형 추가
    const distortion = random(seed1 + seed2) * 0.8;
    const spikiness = random(seed3 + hash) > 0.7 ? 1.5 : 1;
    
    const x = (radius + distortion) * Math.sin(phi) * Math.cos(theta) * spikiness;
    const y = (radius + distortion) * Math.sin(phi) * Math.sin(theta) * spikiness;
    const z = (radius + distortion) * Math.cos(phi) * spikiness;
    
    vertices.push(x, y, z);
  }
  
  // 불규칙한 면 연결 (Delaunay 스타일)
  for (let i = 0; i < complexity - 3; i += 3) {
    // 인접한 점들을 불규칙하게 연결
    const skip = Math.floor(random(hash + i) * 5) + 1;
    if (i + skip < complexity) {
      indices.push(i, i + 1, i + skip);
      indices.push(i + 1, i + 2, i + skip);
    }
  }
  
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  
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
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [performanceLevel] = useState(() => getPerformanceLevel());
  
  // 키워드 기반 지오메트리 생성
  const geometry = useMemo(() => createGenerativeArt(keyword, performanceLevel), [keyword, performanceLevel]);
  
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
    
    // 성능에 따른 업데이트 빈도 조절
    const updateFrequency = performanceLevel === 'high' ? 1 : performanceLevel === 'medium' ? 2 : 3;
    if (Math.floor(time / 16) % updateFrequency !== 0) return;
    
    // 파격적인 글리치 효과: 정점 위치 변형
    for (let i = 0; i < positions.length; i += 3) {
      const originalX = originalPositions[i];
      const originalY = originalPositions[i + 1];
      const originalZ = originalPositions[i + 2];
      
      // 개선된 다층 노이즈 적용
      const noiseX = improvedNoise(originalX * 3, originalY * 3, originalZ * 3, time) * 0.5;
      const noiseY = improvedNoise(originalX * 2.5, originalY * 2.5, originalZ * 2.5, time * 1.2) * 0.5;
      const noiseZ = improvedNoise(originalX * 2, originalY * 2, originalZ * 2, time * 0.8) * 0.5;
      
      // 성능에 따른 글리치 강도 조절
      const baseIntensity = performanceLevel === 'high' ? 1.2 : performanceLevel === 'medium' ? 0.8 : 0.5;
      const timeBasedIntensity = Math.sin(time * 0.003) * 0.5 + 0.5; // 0~1 범위
      const glitchIntensity = baseIntensity * timeBasedIntensity;
      
      // 극한 글리치 효과 적용
      const extremeX = extremeGlitch(originalX, time, glitchIntensity, i * 0.1);
      const extremeY = extremeGlitch(originalY, time, glitchIntensity, i * 0.2);
      const extremeZ = extremeGlitch(originalZ, time, glitchIntensity, i * 0.3);
      
      // 최종 위치 계산 (노이즈 + 극한 글리치)
      positions[i] = extremeX + noiseX * glitchIntensity;
      positions[i + 1] = extremeY + noiseY * glitchIntensity;
      positions[i + 2] = extremeZ + noiseZ * glitchIntensity;
      
      // 불규칙한 스케일 변화 (일부 정점만)
      if (i % 9 === 0) { // 9개 정점마다
        const scaleNoise = improvedNoise(i * 0.01, time * 0.005, 0, 0);
        const scale = 1 + scaleNoise * 0.3;
        positions[i] *= scale;
        positions[i + 1] *= scale;
        positions[i + 2] *= scale;
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    // 파격적인 색상 변화 (더 빠르고 극적인 변화)
    const newColor = createColorFromKeyword(keyword, time);
    
    // 색상 극한 글리치 (가끔 완전히 다른 색상으로 점프)
    if (Math.random() < 0.03) { // 3% 확률
      const glitchColors = [
        new THREE.Color('#FFFFFF'), // 순백
        new THREE.Color('#000000'), // 순흑
        new THREE.Color('#FF0000'), // 순빨강
        new THREE.Color('#00FF00'), // 순초록
        new THREE.Color('#0000FF'), // 순파랑
      ];
      const randomColor = glitchColors[Math.floor(Math.random() * glitchColors.length)];
      materialRef.current.color.copy(randomColor);
    } else {
      materialRef.current.color.copy(newColor);
    }
    
    // 불규칙한 회전 (때로는 급격한 변화)
    const rotationGlitch = Math.random() < 0.02; // 2% 확률로 급격한 회전
    
    if (rotationGlitch) {
      meshRef.current.rotation.x += (Math.random() - 0.5) * 0.5;
      meshRef.current.rotation.y += (Math.random() - 0.5) * 0.5;
      meshRef.current.rotation.z += (Math.random() - 0.5) * 0.5;
    } else {
      // 일반적인 회전에도 불규칙성 추가
      const rotSpeedX = 0.005 + Math.sin(time * 0.001) * 0.003;
      const rotSpeedY = 0.008 + Math.cos(time * 0.0015) * 0.005;
      const rotSpeedZ = 0.003 + Math.sin(time * 0.0008) * 0.002;
      
      meshRef.current.rotation.x += rotSpeedX;
      meshRef.current.rotation.y += rotSpeedY;
      meshRef.current.rotation.z += rotSpeedZ;
    }
    
    // 극한 글리치 점프 효과 (더 파격적이고 불규칙하게)
    const jumpChance = performanceLevel === 'high' ? 0.04 : 0.02; // 확률 증가
    const randomValue = Math.random();
    
    if (randomValue < jumpChance) {
      // 극한 공간 이동
      const intensity = 2 + Math.random() * 3; // 1~5 범위
      meshRef.current.position.x = (Math.random() - 0.5) * intensity;
      meshRef.current.position.y = (Math.random() - 0.5) * intensity;
      meshRef.current.position.z = (Math.random() - 0.5) * intensity * 0.5;
      
      // 크기도 급격하게 변화
      const scale = 0.3 + Math.random() * 1.4; // 0.3~1.7 범위
      meshRef.current.scale.setScalar(scale);
    } else if (randomValue < jumpChance * 3) {
      // 중간 강도 진동
      const vibration = 0.1;
      meshRef.current.position.x += (Math.random() - 0.5) * vibration;
      meshRef.current.position.y += (Math.random() - 0.5) * vibration;
      meshRef.current.position.z += (Math.random() - 0.5) * vibration;
    } else {
      // 원래 위치와 크기로 서서히 복귀
      meshRef.current.position.x *= 0.92;
      meshRef.current.position.y *= 0.92;
      meshRef.current.position.z *= 0.92;
      
      // 크기도 서서히 정상화
      const currentScale = meshRef.current.scale.x;
      const targetScale = 1.0;
      const newScale = currentScale + (targetScale - currentScale) * 0.05;
      meshRef.current.scale.setScalar(newScale);
    }
  });
  
  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        ref={materialRef}
        color="#FF00FF"
        emissive="#330033"
        emissiveIntensity={0.3}
        wireframe={false}
        transparent={true}
        opacity={0.9}
      />
    </mesh>
  );
};

export default GlitchMesh;
