'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPerformanceLevel } from '@/utils/performance';

interface GlitchMeshProps {
  keyword: string;
}

// 키워드에 따른 형태 생성 함수
const createGeometryFromKeyword = (keyword: string, performanceLevel: string) => {
  const hash = keyword.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const geometryType = Math.abs(hash) % 5;
  
  // 성능에 따른 세분화 조절
  const detail = performanceLevel === 'high' ? 64 : performanceLevel === 'medium' ? 32 : 16;
  
  switch (geometryType) {
    case 0:
      return new THREE.SphereGeometry(1.5, detail, detail);
    case 1:
      return new THREE.BoxGeometry(2, 2, 2, detail/2, detail/2, detail/2);
    case 2:
      return new THREE.CylinderGeometry(1, 1.5, 3, detail, detail/2);
    case 3:
      return new THREE.ConeGeometry(1.5, 3, detail, detail/2);
    case 4:
      return new THREE.TorusGeometry(1.2, 0.4, detail/2, detail);
    default:
      return new THREE.SphereGeometry(1.5, detail, detail);
  }
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

// Perlin noise 함수 (간단한 구현)
const noise = (x: number, y: number, z: number) => {
  return (Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453) % 1;
};

const GlitchMesh: React.FC<GlitchMeshProps> = ({ keyword }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [performanceLevel] = useState(() => getPerformanceLevel());
  
  // 키워드 기반 지오메트리 생성
  const geometry = useMemo(() => createGeometryFromKeyword(keyword, performanceLevel), [keyword, performanceLevel]);
  
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
    
    // 글리치 효과: 정점 위치 변형
    for (let i = 0; i < positions.length; i += 3) {
      const originalX = originalPositions[i];
      const originalY = originalPositions[i + 1];
      const originalZ = originalPositions[i + 2];
      
      // Perlin noise 기반 글리치 효과
      const noiseX = noise(originalX * 2 + time * 0.001, originalY * 2, originalZ * 2) * 0.3;
      const noiseY = noise(originalX * 2, originalY * 2 + time * 0.0008, originalZ * 2) * 0.3;
      const noiseZ = noise(originalX * 2, originalY * 2, originalZ * 2 + time * 0.0012) * 0.3;
      
      // 성능에 따른 글리치 강도 조절
      const baseIntensity = performanceLevel === 'high' ? 0.5 : performanceLevel === 'medium' ? 0.3 : 0.2;
      const glitchIntensity = baseIntensity + Math.sin(time * 0.003) * 0.3;
      
      positions[i] = originalX + noiseX * glitchIntensity;
      positions[i + 1] = originalY + noiseY * glitchIntensity;
      positions[i + 2] = originalZ + noiseZ * glitchIntensity;
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    // 색상 변화
    const newColor = createColorFromKeyword(keyword, time);
    materialRef.current.color.copy(newColor);
    
    // 메시 회전
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.008;
    meshRef.current.rotation.z += 0.003;
    
    // 글리치 점프 효과 (랜덤하게 위치 급변)
    const jumpChance = performanceLevel === 'high' ? 0.02 : 0.01;
    if (Math.random() < jumpChance) {
      meshRef.current.position.x = (Math.random() - 0.5) * 0.5;
      meshRef.current.position.y = (Math.random() - 0.5) * 0.5;
      meshRef.current.position.z = (Math.random() - 0.5) * 0.2;
    } else {
      // 원래 위치로 천천히 복귀
      meshRef.current.position.x *= 0.95;
      meshRef.current.position.y *= 0.95;
      meshRef.current.position.z *= 0.95;
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
