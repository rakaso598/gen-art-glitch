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

  // 훨씬 더 많은 궤적으로 압도적인 밀도 - 우주적 복잡성
  const trajectoryCount = performanceLevel === 'high' ? 25 : performanceLevel === 'medium' ? 18 : 12;
  const pointsPerTrajectory = performanceLevel === 'high' ? 150 : performanceLevel === 'medium' ? 100 : 80;

  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const colors: number[] = [];

  // 극도로 어둡고 섬뜩한 색상 팔레트
  const cosmicColors = [
    [0.03, 0.01, 0.08],    // 깊은 보라 어둠
    [0.01, 0.03, 0.10],    // 심연의 청색
    [0.05, 0.01, 0.02],    // 어둠의 적색
    [0.01, 0.05, 0.03],    // 차분한 녹색
    [0.06, 0.03, 0.01],    // 어둠의 주황
    [0.04, 0.01, 0.05],    // 자주빛 그림자
    [0.01, 0.04, 0.06],    // 깊은 청록
    [0.05, 0.02, 0.01],    // 어둠의 황색
    [0.07, 0.01, 0.07],    // 보라빛 무
    [0.01, 0.03, 0.07],    // 얼어붙은 청색
    [0.03, 0.03, 0.01],    // 병든 황록
    [0.06, 0.01, 0.03],    // 진홍 그림자
    [0.01, 0.06, 0.02],    // 독성 그림자
    [0.03, 0.04, 0.01],    // 썩은 녹황
    [0.08, 0.02, 0.01],    // 지옥의 어둠
  ];

  for (let t = 0; t < trajectoryCount; t++) {
    const trajectorySeed = hash + t * 123;

    // 더 넓은 시작 영역
    const startX = (random(trajectorySeed) - 0.5) * 8;
    const startY = (random(trajectorySeed + 1) - 0.5) * 8;
    const startZ = (random(trajectorySeed + 2) - 0.5) * 6;    // 더 많은 패턴 타입 - 압도적인 복잡성
    const patternType = Math.floor(random(trajectorySeed + 3) * 18);
    
    // 우주적 색상 선택
    const colorIndex = (trajectorySeed + hash) % cosmicColors.length;
    const [r, g, b] = cosmicColors[colorIndex];

    let prevX = startX, prevY = startY, prevZ = startZ;

    for (let p = 1; p < pointsPerTrajectory; p++) {
      const progress = p / pointsPerTrajectory;
      const pointSeed = trajectorySeed + p * 0.1;

      let x, y, z;

      // 우주적 섬뜩함과 기하학적 압도감을 위한 극한 패턴들
      switch (patternType) {
        case 0: // 블랙홀 나선 - 중력에 의해 왜곡되는 공간
          const blackHoleRadius = 0.1 + Math.pow(progress, 2) * 15;
          const distortionAngle = progress * Math.PI * 50 + Math.sin(progress * 30) * 5;
          const gravitationalWarp = Math.pow(1 - progress, 3) * 8;
          x = startX + blackHoleRadius * Math.cos(distortionAngle) * gravitationalWarp;
          y = startY + blackHoleRadius * Math.sin(distortionAngle) * gravitationalWarp;
          z = startZ + progress * 20 - 10 + Math.sin(distortionAngle) * 3;
          break;

        case 1: // 시공간 프랙탈 - 무한 반복되는 기하학
          const fractalAmp = 8;
          const fractalLevels = 5;
          x = startX + progress * 15 - 7.5;
          y = startY;
          z = startZ;
          for (let f = 0; f < fractalLevels; f++) {
            const freq = Math.pow(3, f + 1);
            const amp = fractalAmp / Math.pow(2, f);
            const phase = f * Math.PI * 0.6;
            y += Math.sin(progress * Math.PI * freq + phase) * amp;
            z += Math.cos(progress * Math.PI * freq * 0.8 + phase) * amp * 0.4;
            x += Math.sin(progress * Math.PI * freq * 1.3 + phase) * amp * 0.2;
          }
          break;

        case 2: // 차원 붕괴 웨이브 - 현실이 무너지는 파동
          const collapseAmp = 6;
          const dimensionalShift = Math.sin(progress * Math.PI * 2) * Math.PI;
          x = startX + Math.sin(progress * Math.PI * 20 + dimensionalShift) * collapseAmp;
          y = startY + progress * 12 - 6;
          z = startZ + Math.cos(progress * Math.PI * 24 + dimensionalShift) * collapseAmp * 0.8;
          x += Math.sin(progress * Math.PI * 8) * collapseAmp * 0.3;
          z += Math.cos(progress * Math.PI * 12) * collapseAmp * 0.5;
          break;

        case 3: // 초신성 폭발 - 별의 죽음
          const supernovaRadius = Math.pow(progress, 0.3) * 25;
          const shockwaveAngle = random(pointSeed) * Math.PI * 2;
          const shockwavePhi = random(pointSeed + 1) * Math.PI;
          const energyPulse = Math.sin(progress * Math.PI * 8) * 3;
          x = startX + supernovaRadius * Math.sin(shockwavePhi) * Math.cos(shockwaveAngle) + energyPulse;
          y = startY + supernovaRadius * Math.sin(shockwavePhi) * Math.sin(shockwaveAngle) + energyPulse;
          z = startZ + supernovaRadius * Math.cos(shockwavePhi) * 0.6 + energyPulse * 0.5;
          break;

        case 4: // 양자 불확정성 - 입자의 확률적 위치
          const quantumAmp = 8;
          const uncertainty = Math.sqrt(progress) * 2;
          x = prevX + (random(pointSeed) - 0.5) * quantumAmp * uncertainty;
          y = prevY + (random(pointSeed + 1) - 0.5) * quantumAmp * uncertainty;
          z = prevZ + (random(pointSeed + 2) - 0.5) * quantumAmp * uncertainty * 0.5;
          // 양자 점프
          if (random(pointSeed + 3) < 0.1) {
            x += (random(pointSeed + 4) - 0.5) * 15;
            y += (random(pointSeed + 5) - 0.5) * 15;
          }
          break;

        case 5: // 우주 혼돈 어트랙터 - 예측불가능한 궤도
          const sigma = 15, rho = 35, beta = 8/3;
          const dt = 0.03;
          const chaosMultiplier = 1 + Math.sin(progress * Math.PI * 12) * 0.5;
          x = prevX + sigma * (prevY - prevX) * dt * chaosMultiplier;
          y = prevY + (prevX * (rho - prevZ) - prevY) * dt * chaosMultiplier;
          z = prevZ + (prevX * prevY - beta * prevZ) * dt * chaosMultiplier;
          x = startX + x * 0.25;
          y = startY + y * 0.25;
          z = startZ + z * 0.25;
          break;

        case 6: // 외계 생명체 DNA - 비정상적인 이중 나선
          const alienDnaRadius = 3 + progress * 5 + Math.sin(progress * Math.PI * 16) * 2;
          const alienDnaAngle = progress * Math.PI * 18 + Math.cos(progress * Math.PI * 8) * 3;
          const geneticMutation = Math.sin(progress * Math.PI * 24) * 1.5;
          x = startX + alienDnaRadius * Math.cos(alienDnaAngle) + geneticMutation;
          y = startY + progress * 15 - 7.5;
          z = startZ + alienDnaRadius * Math.sin(alienDnaAngle) * 0.7 + geneticMutation * 0.5;
          if (t % 3 === 1) {
            x = startX + alienDnaRadius * Math.cos(alienDnaAngle + Math.PI * 2/3);
            z = startZ + alienDnaRadius * Math.sin(alienDnaAngle + Math.PI * 2/3) * 0.7;
          } else if (t % 3 === 2) {
            x = startX + alienDnaRadius * Math.cos(alienDnaAngle + Math.PI * 4/3);
            z = startZ + alienDnaRadius * Math.sin(alienDnaAngle + Math.PI * 4/3) * 0.7;
          }
          break;

        case 7: // 차원 포털 소용돌이 - 공간의 찢어짐
          const portalRadius = (1 - Math.pow(progress, 0.5)) * 8 + 0.3;
          const portalAngle = progress * Math.PI * 25 + Math.sin(progress * Math.PI * 8) * 5;
          const dimensionalRift = Math.sin(progress * Math.PI * 32) * 2;
          x = startX + portalRadius * Math.cos(portalAngle) + dimensionalRift;
          y = startY + progress * 18 - 9 + dimensionalRift * 0.5;
          z = startZ + portalRadius * Math.sin(portalAngle) + dimensionalRift * 0.3;
          break;

        case 8: // 어둠의 기하학 - 비유클리드 공간
          const nonEuclideanT = progress * Math.PI * 3;
          const darkGeometryScale = 4;
          const spatialDistortion = Math.pow(progress, 1.5) * 3;
          x = startX + darkGeometryScale * (20 * Math.pow(Math.sin(nonEuclideanT), 5)) * 0.15;
          y = startY + darkGeometryScale * (15 * Math.cos(nonEuclideanT) - 7 * Math.cos(3*nonEuclideanT) - 3 * Math.cos(5*nonEuclideanT) - Math.cos(7*nonEuclideanT)) * 0.1;
          z = startZ + Math.sin(progress * Math.PI * 16) * darkGeometryScale * 0.8 + spatialDistortion;
          break;

        case 9: // 우주적 진동 - 다차원 공명
          const resonanceA = 5 + Math.floor(random(pointSeed) * 8);
          const resonanceB = 3 + Math.floor(random(pointSeed + 1) * 8);
          const resonanceC = 7 + Math.floor(random(pointSeed + 2) * 6);
          const resonanceT = progress * Math.PI * 6;
          const cosmicAmplitude = 5;
          x = startX + cosmicAmplitude * Math.sin(resonanceA * resonanceT);
          y = startY + cosmicAmplitude * Math.sin(resonanceB * resonanceT);
          z = startZ + cosmicAmplitude * Math.sin(resonanceC * resonanceT) * 0.6;
          break;

        case 10: // 우주의 매듭 - 시공간 왜곡
        case 10: // 우주의 매듭 - 시공간 왜곡
          const cosmicKnotT = progress * Math.PI * 6;
          const knotComplexity = 3;
          x = startX + 4 * Math.sin(knotComplexity * cosmicKnotT) + 2 * Math.sin(2 * knotComplexity * cosmicKnotT);
          y = startY + 4 * Math.cos(knotComplexity * cosmicKnotT) - 2 * Math.cos(2 * knotComplexity * cosmicKnotT);
          z = startZ + 3 * Math.sin(5 * knotComplexity * cosmicKnotT);
          break;

        case 11: // 어둠의 피보나치 - 자연의 왜곡
          const darkFibAngle = progress * Math.PI * 4 * 1.618;
          const darkFibRadius = Math.pow(progress, 0.8) * 8;
          const fibDistortion = Math.sin(progress * Math.PI * 20) * 2;
          x = startX + darkFibRadius * Math.cos(darkFibAngle) + fibDistortion;
          y = startY + darkFibRadius * Math.sin(darkFibAngle) + fibDistortion * 0.7;
          z = startZ + progress * 12 - 6 + fibDistortion * 0.3;
          break;

        case 12: // 엘드리치 촉수 - 크툴루 기하학
          const tentacleLength = progress * 15;
          const tentacleThickness = Math.sin(progress * Math.PI * 8) * 2;
          const eldritchAngle = progress * Math.PI * 12 + Math.sin(progress * 30) * 3;
          x = startX + tentacleLength * Math.cos(eldritchAngle) + tentacleThickness;
          y = startY + tentacleLength * Math.sin(eldritchAngle) + tentacleThickness * 0.8;
          z = startZ + Math.sin(progress * Math.PI * 16) * 4 + tentacleThickness * 0.5;
          break;

        case 13: // 양자 얽힘 - 입자간 초원거리 상관관계
          const entanglementDistance = 10;
          const quantumPhase = progress * Math.PI * 2;
          const entanglementPair = t % 2 === 0 ? 1 : -1;
          x = startX + entanglementDistance * Math.cos(quantumPhase) * entanglementPair;
          y = startY + entanglementDistance * Math.sin(quantumPhase) * entanglementPair;
          z = startZ + Math.sin(quantumPhase * 4) * 3 * entanglementPair;
          // 순간이동 효과
          if (random(pointSeed) < 0.05) {
            x = -x;
            y = -y;
          }
          break;

        case 14: // 웜홀 터널 - 공간 접힘
          const wormholeRadius = 2 + Math.cos(progress * Math.PI * 6) * 1.5;
          const tunnelProgress = Math.pow(progress, 1.2);
          const wormholeAngle = tunnelProgress * Math.PI * 10;
          const spaceFold = Math.sin(tunnelProgress * Math.PI * 2) * 5;
          x = startX + wormholeRadius * Math.cos(wormholeAngle);
          y = startY + tunnelProgress * 20 - 10 + spaceFold;
          z = startZ + wormholeRadius * Math.sin(wormholeAngle);
          break;

        case 15: // 무한 프랙탈 - 자기 유사성의 공포
          const infiniteLevels = 6;
          x = startX; y = startY; z = startZ;
          for (let level = 0; level < infiniteLevels; level++) {
            const scale = Math.pow(0.7, level);
            const freq = Math.pow(3, level + 1);
            const phase = level * Math.PI * 0.4;
            x += scale * 5 * Math.sin(progress * Math.PI * freq + phase);
            y += scale * 5 * Math.cos(progress * Math.PI * freq * 1.1 + phase);
            z += scale * 3 * Math.sin(progress * Math.PI * freq * 1.3 + phase);
          }
          break;

        case 16: // 시간 역행 - 인과관계 붕괴
          const timeReverse = 1 - progress;
          const causalityBreak = Math.sin(timeReverse * Math.PI * 15);
          x = startX + timeReverse * 10 * Math.cos(timeReverse * Math.PI * 8) + causalityBreak * 3;
          y = startY + timeReverse * 10 * Math.sin(timeReverse * Math.PI * 8) + causalityBreak * 3;
          z = startZ + timeReverse * 5 + causalityBreak * 2;
          break;

        case 17: // 공허의 구 - 무의 기하학
          const voidRadius = progress * 12;
          const voidAngle = Math.sin(progress * Math.PI * 2) * Math.PI;
          const voidPhi = Math.cos(progress * Math.PI * 3) * Math.PI * 0.5;
          const voidDistortion = Math.sin(progress * Math.PI * 20) * 0.5;
          x = startX + voidRadius * Math.sin(voidPhi) * Math.cos(voidAngle) * (1 + voidDistortion);
          y = startY + voidRadius * Math.sin(voidPhi) * Math.sin(voidAngle) * (1 + voidDistortion);
          z = startZ + voidRadius * Math.cos(voidPhi) * (1 + voidDistortion);
          break;

        default:
          // 기본 카오스 패턴 - 완전한 무질서
          const chaosScale = 15;
          x = startX + (random(pointSeed) - 0.5) * chaosScale;
          y = startY + (random(pointSeed + 1) - 0.5) * chaosScale;
          z = startZ + (random(pointSeed + 2) - 0.5) * chaosScale * 0.6;
      }

      // 라인 세그먼트 생성 (이전 점에서 현재 점까지)
      vertices.push(prevX, prevY, prevZ);
      vertices.push(x, y, z);

      // 극도로 절제된 색상 강도
      const baseIntensity = 0.08 + progress * 0.12;
      const cosmicPulse = Math.sin(progress * Math.PI * 8) * 0.06;
      const voidFlicker = Math.sin(progress * Math.PI * 20) * 0.04;
      const intensity = baseIntensity + cosmicPulse + voidFlicker;
      
      // 색상에 기하학적 변조 추가 - 더 어둡고 절제된
      const redShift = r * intensity * (1 + Math.sin(progress * Math.PI * 12) * 0.2);
      const blueShift = g * intensity * (1 + Math.cos(progress * Math.PI * 16) * 0.2); 
      const darkMatter = b * intensity * (1 + Math.sin(progress * Math.PI * 24) * 0.2);
      
      colors.push(redShift, blueShift, darkMatter);
      colors.push(redShift, blueShift, darkMatter);

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

    // 우주적 공포와 압도감을 위한 극한 애니메이션
    for (let i = 0; i < positions.length; i += 3) {
      const originalX = originalPositions[i];
      const originalY = originalPositions[i + 1];
      const originalZ = originalPositions[i + 2];

      // 우주적 섭동 - 시공간의 떨림
      const lineIndex = Math.floor(i / 6);
      const cosmicTremor = Math.sin(time * 2 + lineIndex * 0.1) * 0.8;
      const voidPulse = Math.cos(time * 1.5 + lineIndex * 0.05) * 0.6;
      const darkEnergyWave = Math.sin(time * 4 + lineIndex * 0.3) * 0.4;
      
      // 차원간 불안정성
      const dimensionalInstability = (Math.sin(originalX * 8 + time * 6) * Math.cos(originalY * 6 + time * 4)) * 0.5;
      const quantumFluctuation = Math.sin(time * 12 + lineIndex * 0.2) * 0.3;

      // 현실 붕괴 글리치 (18% 확률로 더 자주)
      if (Math.random() < 0.18) {
        // 완전한 공간 이동 - 더 극적으로
        positions[i] = originalX + (Math.random() - 0.5) * 25;
        positions[i + 1] = originalY + (Math.random() - 0.5) * 25;
        positions[i + 2] = originalZ + (Math.random() - 0.5) * 15;

        // 색상 반전과 극한 변화 - 섬뜩한 색상으로
        colors[i] = Math.random() * 0.8 + 0.1;
        colors[i + 1] = Math.random() * 0.6 + 0.05;
        colors[i + 2] = Math.random() * 0.9 + 0.1;
      } else {
        // 일반적인 우주적 움직임
        positions[i] = originalX + cosmicTremor + dimensionalInstability + quantumFluctuation;
        positions[i + 1] = originalY + voidPulse + dimensionalInstability * 1.5 + quantumFluctuation * 0.8;
        positions[i + 2] = originalZ + darkEnergyWave + dimensionalInstability * 0.8 + quantumFluctuation * 0.4;

        // 어둠의 펄스 효과 - 섬뜩한 깜빡임, 더 어둡게
        const voidPulseIntensity = 0.2 + Math.sin(time * 6 + lineIndex * 0.4) * 0.15;
        const cosmicDecay = 0.4 + Math.cos(time * 3 + lineIndex * 0.2) * 0.1;
        colors[i] *= voidPulseIntensity;
        colors[i + 1] *= cosmicDecay;
        colors[i + 2] *= voidPulseIntensity * cosmicDecay;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    // 우주적 공포의 회전 - 예측불가능하고 압도적
    const cosmicRotationX = 0.003 + Math.sin(time * 1.2) * 0.004;
    const cosmicRotationY = 0.006 + Math.cos(time * 0.8) * 0.005;
    const cosmicRotationZ = 0.002 + Math.sin(time * 2.1) * 0.003;
    
    lineRef.current.rotation.x += cosmicRotationX;
    lineRef.current.rotation.y += cosmicRotationY;
    lineRef.current.rotation.z += cosmicRotationZ;

    // 현실 붕괴 점프 - 더 자주, 더 극적으로
    if (Math.random() < 0.12) {
      lineRef.current.position.x = (Math.random() - 0.5) * 8;
      lineRef.current.position.y = (Math.random() - 0.5) * 8;
      lineRef.current.position.z = (Math.random() - 0.5) * 5;

      // 극한 회전 글리치 - 공간 왜곡
      lineRef.current.rotation.x += (Math.random() - 0.5) * 1.0;
      lineRef.current.rotation.y += (Math.random() - 0.5) * 1.0;
      lineRef.current.rotation.z += (Math.random() - 0.5) * 1.0;
    } else {
      // 서서히 중심으로 복귀 - 더 느리게
      lineRef.current.position.x *= 0.98;
      lineRef.current.position.y *= 0.98;
      lineRef.current.position.z *= 0.98;
    }

    // 우주적 호흡 - 압도적인 스케일 변화
    const cosmicBreathing = 1 + Math.sin(time * 0.8) * 0.3 + Math.cos(time * 1.2) * 0.2;
    lineRef.current.scale.setScalar(cosmicBreathing);
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        vertexColors={true}
        transparent={true}
        opacity={0.25}
        blending={THREE.NormalBlending}
        linewidth={0.8}
      />
    </lineSegments>
  );
};

export default TrajectoryLines;
