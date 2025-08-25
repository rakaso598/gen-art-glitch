'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface JumpscareFlashProps {
  keyword: string;
}

// 갑작스러운 점프케어 효과
const JumpscareFlash: React.FC<JumpscareFlashProps> = ({ keyword }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [lastFlash, setLastFlash] = useState(0);

  // 키워드 기반 플래시 강도 계산
  const flashIntensity = useMemo(() => {
    const hash = keyword.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return 0.5 + (Math.abs(hash) % 100) / 200; // 0.5 ~ 1.0
  }, [keyword]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // 불규칙한 간격으로 점프케어 효과 (15-30초마다)
    if (time - lastFlash > 15 + Math.random() * 15) {
      setIsFlashing(true);
      setLastFlash(time);

      // 0.1초 후 효과 종료
      setTimeout(() => {
        setIsFlashing(false);
      }, 100);
    }

    // 플래시 효과 중일 때
    if (isFlashing) {
      meshRef.current.scale.setScalar(50); // 화면 전체를 덮음
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = flashIntensity;
    } else {
      meshRef.current.scale.setScalar(0.01); // 보이지 않게
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 4]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        color="#FF0000"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default JumpscareFlash;
