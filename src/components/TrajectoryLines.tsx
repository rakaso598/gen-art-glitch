'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPerformanceLevel } from '@/utils/performance';

interface TrajectoryLinesProps {
  keyword: string;
}

// 극한 네온 궤적 라인 생성 함수
const createNeonTrajectoryLines = (keyword: string, performanceLevel: string) => {
  const hash = keyword.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  // 훨씬 더 많은 궤적으로 밀도 높은 네온 라인 아트
  const trajectoryCount = performanceLevel === 'high' ? 30 : performanceLevel === 'medium' ? 20 : 12;
  const pointsPerTrajectory = performanceLevel === 'high' ? 150 : performanceLevel === 'medium' ? 100 : 60;

  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const colors: number[] = [];

  // 강렬한 네온 색상 팔레트
  const neonColors = [
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

  for (let t = 0; t < trajectoryCount; t++) {
    const trajectorySeed = hash + t * 123;

    // 더 넓은 시작 영역
    const startX = (random(trajectorySeed) - 0.5) * 8;
    const startY = (random(trajectorySeed + 1) - 0.5) * 8;
    const startZ = (random(trajectorySeed + 2) - 0.5) * 6;

    // 더 많은 패턴 타입
    const patternType = Math.floor(random(trajectorySeed + 3) * 12);

    // 네온 색상 선택
    const colorIndex = (trajectorySeed + hash) % neonColors.length;
    const [r, g, b] = neonColors[colorIndex];

    let prevX = startX, prevY = startY, prevZ = startZ;

    for (let p = 1; p < pointsPerTrajectory; p++) {
      const progress = p / pointsPerTrajectory;
      const pointSeed = trajectorySeed + p * 0.1;

      let x, y, z;

      // 극한 기하학적 궤적 패턴들
      switch (patternType) {
        case 0: // 극한 나선 - 더 복잡한 3D 나선
          const spiralRadius = 0.5 + progress * 5;
          const spiralAngle = progress * Math.PI * 20 + random(pointSeed) * 2;
          const spiralHeight = Math.sin(progress * Math.PI * 4) * 2;
          x = startX + spiralRadius * Math.cos(spiralAngle);
          y = startY + spiralRadius * Math.sin(spiralAngle) + spiralHeight;
          z = startZ + progress * 8 - 4;
          break;

        case 1: // 프랙탈 지그재그 - 더 복잡한 프랙탈
          const zigAmp = 4;
          const fractalLevel = 3;
          x = startX + progress * 10 - 5;
          y = startY;
          z = startZ;
          for (let f = 0; f < fractalLevel; f++) {
            const freq = Math.pow(2, f + 2);
            const amp = zigAmp / Math.pow(2, f);
            y += Math.sin(progress * Math.PI * freq) * amp;
            z += Math.cos(progress * Math.PI * freq * 0.7) * amp * 0.3;
          }
          break;

        case 2: // 3D 웨이브 - 다중 주파수
          const waveAmp = 3;
          x = startX + Math.sin(progress * Math.PI * 12) * waveAmp;
          y = startY + progress * 8 - 4;
          z = startZ + Math.cos(progress * Math.PI * 16) * waveAmp * 0.7;
          x += Math.sin(progress * Math.PI * 6) * waveAmp * 0.5;
          z += Math.sin(progress * Math.PI * 8) * waveAmp * 0.3;
          break;

        case 3: // 폭발형 분산 - 더 역동적
          const explosionRadius = Math.pow(progress, 1.5) * 8;
          const explosionAngle = random(pointSeed) * Math.PI * 2;
          const explosionPhi = random(pointSeed + 1) * Math.PI;
          x = startX + explosionRadius * Math.sin(explosionPhi) * Math.cos(explosionAngle);
          y = startY + explosionRadius * Math.sin(explosionPhi) * Math.sin(explosionAngle);
          z = startZ + explosionRadius * Math.cos(explosionPhi) * 0.5;
          break;

        case 4: // 카오스 궤적 - 완전히 예측 불가능
          const chaosAmp = 4;
          x = prevX + (random(pointSeed) - 0.5) * chaosAmp * 0.3;
          y = prevY + (random(pointSeed + 1) - 0.5) * chaosAmp * 0.3;
          z = prevZ + (random(pointSeed + 2) - 0.5) * chaosAmp * 0.2;
          break;

        case 5: // 로렌츠 어트랙터 스타일 - 더 극적
          const sigma = 10, rho = 28, beta = 8 / 3;
          const dt = 0.02;
          x = prevX + sigma * (prevY - prevX) * dt;
          y = prevY + (prevX * (rho - prevZ) - prevY) * dt;
          z = prevZ + (prevX * prevY - beta * prevZ) * dt;
          x = startX + x * 0.15;
          y = startY + y * 0.15;
          z = startZ + z * 0.15;
          break;

        case 6: // DNA 나선 - 이중 나선
          const dnaRadius = 2 + progress * 2;
          const dnaAngle = progress * Math.PI * 10;
          x = startX + dnaRadius * Math.cos(dnaAngle);
          y = startY + progress * 8 - 4;
          z = startZ + dnaRadius * Math.sin(dnaAngle) * 0.5;
          if (t % 2 === 1) {
            x = startX + dnaRadius * Math.cos(dnaAngle + Math.PI);
            z = startZ + dnaRadius * Math.sin(dnaAngle + Math.PI) * 0.5;
          }
          break;

        case 7: // 토네이도 궤적
          const tornadoRadius = (1 - progress) * 4 + 0.5;
          const tornadoAngle = progress * Math.PI * 15;
          x = startX + tornadoRadius * Math.cos(tornadoAngle);
          y = startY + progress * 10 - 5;
          z = startZ + tornadoRadius * Math.sin(tornadoAngle);
          break;

        case 8: // 하트 곡선 3D
          const heartT = progress * Math.PI * 2;
          const heartScale = 2;
          x = startX + heartScale * (16 * Math.pow(Math.sin(heartT), 3)) * 0.1;
          y = startY + heartScale * (13 * Math.cos(heartT) - 5 * Math.cos(2 * heartT) - 2 * Math.cos(3 * heartT) - Math.cos(4 * heartT)) * 0.1;
          z = startZ + Math.sin(progress * Math.PI * 8) * heartScale * 0.5;
          break;

        case 9: // 리사쥬 곡선
          const lissajousA = 3 + Math.floor(random(pointSeed) * 5);
          const lissajousB = 2 + Math.floor(random(pointSeed + 1) * 5);
          const lissajousT = progress * Math.PI * 4;
          x = startX + 3 * Math.sin(lissajousA * lissajousT);
          y = startY + 3 * Math.sin(lissajousB * lissajousT);
          z = startZ + 2 * Math.sin((lissajousA + lissajousB) * lissajousT * 0.5);
          break;

        case 10: // 트레포일 매듭
          const trefoilT = progress * Math.PI * 4;
          x = startX + 2 * Math.sin(trefoilT) + Math.sin(2 * trefoilT);
          y = startY + 2 * Math.cos(trefoilT) - Math.cos(2 * trefoilT);
          z = startZ + Math.sin(3 * trefoilT);
          break;

        case 11: // 피보나치 나선
          const fibAngle = progress * Math.PI * 2 * 1.618;
          const fibRadius = Math.sqrt(progress) * 4;
          x = startX + fibRadius * Math.cos(fibAngle);
          y = startY + fibRadius * Math.sin(fibAngle);
          z = startZ + progress * 6 - 3;
          break;

        default:
          x = startX + (random(pointSeed) - 0.5) * 8;
          y = startY + (random(pointSeed + 1) - 0.5) * 8;
          z = startZ + (random(pointSeed + 2) - 0.5) * 4;
      }

      // 라인 세그먼트 생성 (이전 점에서 현재 점까지)
      vertices.push(prevX, prevY, prevZ);
      vertices.push(x, y, z);

      // 각 라인 세그먼트의 양 끝에 강렬한 네온 색상
      const intensity = 0.8 + progress * 0.2 + Math.sin(progress * Math.PI * 4) * 0.1;
      colors.push(r * intensity, g * intensity, b * intensity);
      colors.push(r * intensity, g * intensity, b * intensity);

      prevX = x;
      prevY = y;
      prevZ = z;
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  return geometry;
};

const TrajectoryLines: React.FC<TrajectoryLinesProps> = ({ keyword }) => {
  const lineRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const [performanceLevel] = useState(() => getPerformanceLevel());

  const geometry = useMemo(() => createNeonTrajectoryLines(keyword, performanceLevel), [keyword, performanceLevel]);

  const originalPositions = useMemo(() => {
    if (geometry.attributes.position) {
      return geometry.attributes.position.array.slice();
    }
    return new Float32Array();
  }, [geometry]);

  useFrame((state) => {
    if (!lineRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;

    // 극한 궤적 흐름 애니메이션
    for (let i = 0; i < positions.length; i += 3) {
      const originalX = originalPositions[i];
      const originalY = originalPositions[i + 1];
      const originalZ = originalPositions[i + 2];

      // 라인 따라 흐르는 효과 - 더 강렬하게
      const lineIndex = Math.floor(i / 6);
      const flowWave = Math.sin(time * 3 + lineIndex * 0.2) * 0.4;
      const glitchNoise = (Math.sin(originalX * 15 + time * 8) * Math.cos(originalY * 12 + time * 5)) * 0.2;
      const turbulence = Math.sin(time * 10 + lineIndex * 0.1) * 0.1;

      // 극한 글리치 (12% 확률로 증가)
      if (Math.random() < 0.12) {
        positions[i] = originalX + (Math.random() - 0.5) * 10;
        positions[i + 1] = originalY + (Math.random() - 0.5) * 10;
        positions[i + 2] = originalZ + (Math.random() - 0.5) * 6;

        // 색상 극한 변화 - 더 밝고 강렬하게
        colors[i] = Math.random() * 1.5;
        colors[i + 1] = Math.random() * 1.5;
        colors[i + 2] = Math.random() * 1.5;
      } else {
        positions[i] = originalX + flowWave + glitchNoise + turbulence;
        positions[i + 1] = originalY + flowWave * 0.8 + glitchNoise * 1.2 + turbulence * 0.6;
        positions[i + 2] = originalZ + flowWave * 0.5 + glitchNoise * 0.7 + turbulence * 0.3;

        // 네온 펄스 효과
        const pulseIntensity = 1 + Math.sin(time * 4 + lineIndex * 0.3) * 0.3;
        colors[i] *= pulseIntensity;
        colors[i + 1] *= pulseIntensity;
        colors[i + 2] *= pulseIntensity;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    // 전체 라인 시스템 회전 - 더 역동적으로
    lineRef.current.rotation.x += 0.005 + Math.sin(time * 2) * 0.002;
    lineRef.current.rotation.y += 0.008 + Math.cos(time * 1.5) * 0.003;
    lineRef.current.rotation.z += 0.003 + Math.sin(time * 3) * 0.001;

    // 극한 글리치 점프 - 확률 증가
    if (Math.random() < 0.08) {
      lineRef.current.position.x = (Math.random() - 0.5) * 3;
      lineRef.current.position.y = (Math.random() - 0.5) * 3;
      lineRef.current.position.z = (Math.random() - 0.5) * 2;

      // 극한 회전 글리치
      lineRef.current.rotation.x += (Math.random() - 0.5) * 0.5;
      lineRef.current.rotation.y += (Math.random() - 0.5) * 0.5;
      lineRef.current.rotation.z += (Math.random() - 0.5) * 0.5;
    } else {
      // 중심으로 복귀
      lineRef.current.position.x *= 0.95;
      lineRef.current.position.y *= 0.95;
      lineRef.current.position.z *= 0.95;
    }

    // 전체 스케일 펄스
    const scalePulse = 1 + Math.sin(time * 1.5) * 0.1;
    lineRef.current.scale.setScalar(scalePulse);
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        vertexColors={true}
        transparent={true}
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        linewidth={2}
      />
    </lineSegments>
  );
};

export default TrajectoryLines;
