'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPerformanceLevel } from '@/utils/performance';

interface CreepyGlitchMeshProps {
  keyword: string;
}

// 섬뜩한 글리치 엔티티 생성 함수
const createCreepyGlitchEntity = (keyword: string, performanceLevel: string) => {
  const hash = keyword.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 성능에 따른 복잡도 설정
  const complexity = performanceLevel === 'high' ? 1.0 : performanceLevel === 'medium' ? 0.7 : 0.4;
  const vertexCount = Math.floor(800 * complexity);
  const fragmentCount = Math.floor(50 * complexity);

  // 기본 불규칙 다면체 생성 (TorusKnot 기반으로 왜곡)
  const baseGeometry = new THREE.TorusKnotGeometry(1.2, 0.4, 64, 16, 2, 3);
  const vertices = baseGeometry.attributes.position.array as Float32Array;
  const colors: number[] = [];
  
  // 각 정점을 무작위로 왜곡하여 비정형적 형태 생성
  for (let i = 0; i < vertices.length; i += 3) {
    const vertexSeed = hash + i * 0.1;
    
    // 불규칙한 왜곡 적용
    vertices[i] += (random(vertexSeed) - 0.5) * 0.8;     // x
    vertices[i + 1] += (random(vertexSeed + 1) - 0.5) * 0.8; // y  
    vertices[i + 2] += (random(vertexSeed + 2) - 0.5) * 0.8; // z

    // 어두운 기본 색상 (짙은 남색/보라색)
    const colorChoice = Math.floor(random(vertexSeed + 3) * 3);
    let r, g, b;
    
    switch (colorChoice) {
      case 0: // 짙은 남색
        r = 0.1; g = 0.14; b = 0.5; // #1A237E
        break;
      case 1: // 검은 보라색  
        r = 0.19; g = 0.11; b = 0.57; // #311B92
        break;
      case 2: // 매우 어두운 회색
        r = 0.05; g = 0.05; b = 0.08;
        break;
      default:
        r = 0.1; g = 0.1; b = 0.15;
    }

    colors.push(r, g, b);
  }

  // 추가 파편들 생성 (공중에 떠다니는 글리치 조각들)
  const fragmentVertices: number[] = [];
  const fragmentColors: number[] = [];

  for (let f = 0; f < fragmentCount; f++) {
    const fragmentSeed = hash + f * 50;
    
    // 파편의 위치 (메인 오브젝트 주변)
    const x = (random(fragmentSeed) - 0.5) * 8;
    const y = (random(fragmentSeed + 1) - 0.5) * 8;
    const z = (random(fragmentSeed + 2) - 0.5) * 8;
    
    // 작은 파편 생성 (삼각형 형태)
    const size = 0.1 + random(fragmentSeed + 3) * 0.2;
    
    // 삼각형 정점들
    fragmentVertices.push(
      x, y, z,
      x + size, y, z,
      x, y + size, z
    );

    // 파편 색상 (가끔 번쩍이는 네온)
    const isGlitch = random(fragmentSeed + 4) > 0.7;
    if (isGlitch) {
      // 번쩍이는 마젠타/시안
      fragmentColors.push(1, 0, 1, 1, 0, 1, 1, 0, 1); // 마젠타
    } else {
      // 어두운 기본 색상
      fragmentColors.push(0.05, 0.05, 0.1, 0.05, 0.05, 0.1, 0.05, 0.05, 0.1);
    }
  }

  // 메인 지오메트리 설정
  const mainGeometry = new THREE.BufferGeometry();
  mainGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  mainGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
  mainGeometry.computeVertexNormals();

  // 파편 지오메트리 설정
  const fragmentGeometry = new THREE.BufferGeometry();
  fragmentGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(fragmentVertices), 3));
  fragmentGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(fragmentColors), 3));

  return { mainGeometry, fragmentGeometry, vertexCount: vertices.length / 3 };
};

const CreepyGlitchMesh: React.FC<CreepyGlitchMeshProps> = ({ keyword }) => {
  const mainMeshRef = useRef<THREE.Mesh>(null);
  const fragmentMeshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  const [performanceLevel] = useState(getPerformanceLevel());
  const [glitchTime, setGlitchTime] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  // 지오메트리 생성
  const { mainGeometry, fragmentGeometry, vertexCount } = useMemo(() => 
    createCreepyGlitchEntity(keyword, performanceLevel), [keyword, performanceLevel]
  );

  // 글리치 효과를 위한 원본 정점 저장
  const originalVertices = useMemo(() => {
    const positions = mainGeometry.attributes.position.array as Float32Array;
    return new Float32Array(positions);
  }, [mainGeometry]);

  useFrame((state) => {
    if (!mainMeshRef.current) return;

    const time = state.clock.elapsedTime;
    const mesh = mainMeshRef.current;
    const positions = mainGeometry.attributes.position.array as Float32Array;

    // 글리치 타이밍 제어 (불규칙한 간격)
    const glitchTrigger = Math.sin(time * 0.5) > 0.95 || Math.sin(time * 0.3 + 1) > 0.98;
    
    if (glitchTrigger && !isGlitching) {
      setIsGlitching(true);
      setGlitchTime(time);
    }

    // 글리치 효과 적용
    if (isGlitching && time - glitchTime < 0.3) {
      // 정점 파괴 효과
      for (let i = 0; i < positions.length; i += 3) {
        if (Math.random() > 0.7) {
          // 갑작스럽게 정점을 다른 위치로 이동
          positions[i] = (Math.random() - 0.5) * 10;     // x
          positions[i + 1] = (Math.random() - 0.5) * 10; // y
          positions[i + 2] = (Math.random() - 0.5) * 2;  // z
        }
      }
      
      // 색상 번쩍임 효과
      if (materialRef.current) {
        materialRef.current.emissive.setRGB(
          Math.random() > 0.5 ? 1 : 0,
          0,
          Math.random() > 0.5 ? 1 : 0
        );
      }
    } else if (time - glitchTime > 0.3) {
      // 원상복구
      setIsGlitching(false);
      for (let i = 0; i < positions.length; i++) {
        positions[i] = originalVertices[i] + (Math.random() - 0.5) * 0.1;
      }
      
      if (materialRef.current) {
        materialRef.current.emissive.setRGB(0, 0, 0);
      }
    }

    // 지속적인 미세 변형
    for (let i = 0; i < positions.length; i += 9) { // 일부 정점만
      if (Math.random() > 0.95) {
        positions[i] += (Math.random() - 0.5) * 0.05;
        positions[i + 1] += (Math.random() - 0.5) * 0.05;
      }
    }

    mainGeometry.attributes.position.needsUpdate = true;

    // 불안정한 회전
    mesh.rotation.x += 0.002 + Math.random() * 0.005;
    mesh.rotation.y += 0.003 + Math.random() * 0.003;
    mesh.rotation.z += 0.001 + Math.random() * 0.002;

    // 카메라 흔들림 효과
    if (glitchTrigger) {
      state.camera.position.x += (Math.random() - 0.5) * 0.1;
      state.camera.position.y += (Math.random() - 0.5) * 0.1;
    }

    // 파편 애니메이션
    if (fragmentMeshRef.current) {
      fragmentMeshRef.current.rotation.x += 0.01;
      fragmentMeshRef.current.rotation.y -= 0.008;
    }
  });

  return (
    <group>
      {/* 메인 글리치 엔티티 */}
      <mesh ref={mainMeshRef} geometry={mainGeometry}>
        <meshStandardMaterial
          ref={materialRef}
          vertexColors
          wireframe={false}
          transparent
          opacity={0.9}
          emissive="#000000"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* 떠다니는 파편들 */}
      <points ref={fragmentMeshRef} geometry={fragmentGeometry}>
        <pointsMaterial
          vertexColors
          size={0.05}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

export default CreepyGlitchMesh;
