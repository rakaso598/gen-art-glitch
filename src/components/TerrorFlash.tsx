'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TerrorFlashProps {
  keyword: string;
}

const TerrorFlash: React.FC<TerrorFlashProps> = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [lastTerror, setLastTerror] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // 화면 전체를 덮는 거대한 평면 생성
  const geometry = new THREE.PlaneGeometry(100, 100);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // 15-30초마다 갑작스러운 공포 효과
    if (time - lastTerror > 15 + Math.random() * 15 && Math.random() > 0.995) {
      setLastTerror(time);
      setIsActive(true);

      if (meshRef.current && materialRef.current) {
        // 갑작스럽게 화면 전체가 빨갛게 번쩍임
        materialRef.current.color.setRGB(1, 0, 0);
        materialRef.current.opacity = 0.8;
        meshRef.current.visible = true;

        // 카메라 위치에 맞춰 평면 위치 조정
        meshRef.current.position.copy(state.camera.position);
        meshRef.current.position.z -= 0.1; // 카메라 바로 앞에
        meshRef.current.lookAt(state.camera.position);
      }

      // 점진적으로 사라짐
      setTimeout(() => {
        if (materialRef.current) {
          materialRef.current.opacity = 0.4;
        }
      }, 50);

      setTimeout(() => {
        if (materialRef.current) {
          materialRef.current.opacity = 0.1;
        }
      }, 100);

      setTimeout(() => {
        if (meshRef.current) {
          meshRef.current.visible = false;
        }
        setIsActive(false);
      }, 200);
    }

    // 미세한 붉은 깜빡임 (가끔)
    if (Math.random() > 0.998 && !isActive) {
      if (meshRef.current && materialRef.current) {
        materialRef.current.color.setRGB(0.5, 0, 0);
        materialRef.current.opacity = 0.1;
        meshRef.current.visible = true;

        meshRef.current.position.copy(state.camera.position);
        meshRef.current.position.z -= 0.1;
        meshRef.current.lookAt(state.camera.position);

        setTimeout(() => {
          if (meshRef.current) {
            meshRef.current.visible = false;
          }
        }, 30);
      }
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} visible={false}>
      <meshBasicMaterial
        ref={materialRef}
        color="#FF0000"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default TerrorFlash;
