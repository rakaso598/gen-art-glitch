'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
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

  // 성능에 따른 복잡도 설정 (대폭 감소)
  const complexity = performanceLevel === 'high' ? 0.5 : performanceLevel === 'medium' ? 0.3 : 0.2;
  const fragmentCount = Math.floor(20 * complexity); // 파편 수 감소

  // 기본 불규칙 다면체 생성 (더 단순한 형태)
  const baseGeometry = new THREE.TorusKnotGeometry(1.2, 0.4, 32, 8, 2, 3); // 해상도 절반으로 감소
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

  return { mainGeometry, fragmentGeometry };
};

const CreepyGlitchMesh: React.FC<CreepyGlitchMeshProps> = ({ keyword }) => {
  const mainMeshRef = useRef<THREE.Mesh>(null);
  const fragmentMeshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const originalVerticesRef = useRef<Float32Array | null>(null);

  const [performanceLevel] = useState(getPerformanceLevel());
  const [glitchTime, setGlitchTime] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [lastJumpscare, setLastJumpscare] = useState(0);

  // 지오메트리 생성 (메모이제이션으로 불필요한 재생성 방지)
  const { mainGeometry, fragmentGeometry } = useMemo(() =>
    createCreepyGlitchEntity(keyword, performanceLevel), [keyword, performanceLevel]
  );

  // 원본 정점 데이터 저장 (메모리 누수 방지)
  useEffect(() => {
    const positions = mainGeometry.attributes.position.array as Float32Array;
    originalVerticesRef.current = new Float32Array(positions);

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (originalVerticesRef.current) {
        originalVerticesRef.current = null;
      }
    };
  }, [mainGeometry]);

  useFrame((state) => {
    if (!mainMeshRef.current || !originalVerticesRef.current) return;

    const time = state.clock.elapsedTime;
    const mesh = mainMeshRef.current;
    const positions = mainGeometry.attributes.position.array as Float32Array;

    // 글리치 타이밍 제어 (더 자주, 더 무섭게)
    const glitchTrigger = Math.sin(time * 0.8) > 0.9 || Math.sin(time * 0.4 + 1) > 0.93 || Math.random() > 0.995;

    if (glitchTrigger && !isGlitching) {
      setIsGlitching(true);
      setGlitchTime(time);
    }

    // 더 강렬한 글리치 효과
    if (isGlitching && time - glitchTime < 0.4) {
      // 정점 파괴 효과 (더 강력하게)
      for (let i = 0; i < positions.length; i += 3) {
        if (Math.random() > 0.6) { // 더 많은 정점 변형
          // 갑작스럽고 극단적인 정점 이동
          positions[i] = originalVerticesRef.current[i] + (Math.random() - 0.5) * 15;     // x
          positions[i + 1] = originalVerticesRef.current[i + 1] + (Math.random() - 0.5) * 15; // y
          positions[i + 2] = originalVerticesRef.current[i + 2] + (Math.random() - 0.5) * 8;  // z
        }
      }

      // 더 강렬한 색상 번쩍임 효과
      if (materialRef.current) {
        const redIntensity = Math.random();
        materialRef.current.emissive.setRGB(
          redIntensity > 0.3 ? 2.0 : 0,
          0,
          redIntensity > 0.7 ? 1.0 : 0
        );
        // 투명도도 변경해서 더 무서운 효과
        materialRef.current.opacity = 0.3 + Math.random() * 0.7;
      }

      // 메시 자체도 변형
      mesh.scale.setScalar(0.8 + Math.random() * 0.6);
    } else if (time - glitchTime > 0.4) {
      // 원상복구 (부드럽게)
      setIsGlitching(false);
      for (let i = 0; i < positions.length; i++) {
        positions[i] = originalVerticesRef.current[i] + (Math.random() - 0.5) * 0.2;
      }

      if (materialRef.current) {
        materialRef.current.emissive.setRGB(0, 0, 0);
        materialRef.current.opacity = 0.9;
      }
      mesh.scale.setScalar(1.0);
    }

    // 지속적인 미세 변형 (더 활발하게)
    for (let i = 0; i < positions.length; i += 6) { // 더 많은 정점
      if (Math.random() > 0.9) {
        positions[i] += (Math.random() - 0.5) * 0.08;
        positions[i + 1] += (Math.random() - 0.5) * 0.08;
        positions[i + 2] += (Math.random() - 0.5) * 0.04;
      }
    }

    mainGeometry.attributes.position.needsUpdate = true;

    // 더 불안정하고 무서운 회전
    const rotationIntensity = isGlitching ? 0.02 : 0.005;
    mesh.rotation.x += rotationIntensity + Math.random() * 0.01;
    mesh.rotation.y += rotationIntensity * 1.5 + Math.random() * 0.008;
    mesh.rotation.z += rotationIntensity * 0.5 + Math.random() * 0.005;

    // 갑작스러운 점프스케어 효과 (가끔)
    if (time - lastJumpscare > 10 && Math.random() > 0.998) {
      setLastJumpscare(time);
      mesh.position.set(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 1
      );
      setTimeout(() => {
        mesh.position.set(0, 0, 0);
      }, 200);
    }

    // 파편 애니메이션 (더 역동적으로)
    if (fragmentMeshRef.current) {
      fragmentMeshRef.current.rotation.x += 0.015 + Math.random() * 0.005;
      fragmentMeshRef.current.rotation.y -= 0.012 + Math.random() * 0.004;
      fragmentMeshRef.current.rotation.z += 0.008 + Math.random() * 0.003;

      // 파편들도 가끔 위치 변경
      if (Math.random() > 0.99) {
        fragmentMeshRef.current.position.set(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 2
        );
      }
    }
  });

  return (
    <group>
      {/* 메인 글리치 엔티티 - 더 무서운 재질 */}
      <mesh ref={mainMeshRef} geometry={mainGeometry}>
        <meshStandardMaterial
          ref={materialRef}
          vertexColors
          wireframe={false}
          transparent
          opacity={0.9}
          emissive="#000000"
          roughness={0.9}
          metalness={0.1}
          side={THREE.DoubleSide} // 양면 렌더링으로 더 두꺼운 느낌
        />
      </mesh>

      {/* 추가 무서운 외곽선 효과 */}
      <mesh geometry={mainGeometry}>
        <meshBasicMaterial
          color="#FF0000"
          wireframe={true}
          transparent
          opacity={isGlitching ? 0.8 : 0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 떠다니는 파편들 - 더 크고 무섭게 */}
      <points ref={fragmentMeshRef} geometry={fragmentGeometry}>
        <pointsMaterial
          vertexColors
          size={isGlitching ? 0.15 : 0.08}
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>

      {/* 추가 공포 효과: 갑작스럽게 나타나는 빨간 구체들 */}
      {isGlitching && (
        <>
          <mesh position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5]}>
            <sphereGeometry args={[0.1, 8, 6]} />
            <meshBasicMaterial color="#FF0000" transparent opacity={0.8} />
          </mesh>
          <mesh position={[(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4]}>
            <sphereGeometry args={[0.05, 6, 4]} />
            <meshBasicMaterial color="#990000" transparent opacity={0.6} />
          </mesh>
        </>
      )}
    </group>
  );
};

export default CreepyGlitchMesh;
