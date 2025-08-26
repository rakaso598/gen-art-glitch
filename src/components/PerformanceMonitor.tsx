'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';

interface PerformanceMonitorProps {
  onPerformanceIssue?: () => void;
  onFpsUpdate?: (fps: number) => void;
}

// Canvas 내부용 성능 모니터링 (UI 없음)
const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ onPerformanceIssue, onFpsUpdate }) => {
  const lastTime = useRef(performance.now());
  const frames = useRef(0);
  const fpsHistoryRef = useRef<number[]>([]);
  const performanceIssueCountRef = useRef(0);

  useFrame(() => {
    frames.current++;
    const now = performance.now();

    if (now - lastTime.current >= 1000) {
      const currentFps = Math.round((frames.current * 1000) / (now - lastTime.current));

      // 외부로 FPS 전달
      if (onFpsUpdate) {
        onFpsUpdate(currentFps);
      }

      // FPS 히스토리 유지 (최근 5초)
      fpsHistoryRef.current.push(currentFps);
      if (fpsHistoryRef.current.length > 5) {
        fpsHistoryRef.current.shift();
      }

      // 성능 문제 감지
      if (currentFps < 15) {
        performanceIssueCountRef.current++;
        if (performanceIssueCountRef.current >= 3 && onPerformanceIssue) {
          console.warn('Performance issue detected! FPS:', currentFps);
          onPerformanceIssue();
          performanceIssueCountRef.current = 0; // 재설정
        }
      } else {
        performanceIssueCountRef.current = 0; // 정상 상태시 카운터 리셋
      }

      frames.current = 0;
      lastTime.current = now;
    }
  });

  // 메모리 사용량 모니터링
  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as Performance & {
          memory: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
          };
        }).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;

        // 메모리 사용량이 85% 이상이면 성능 문제로 간주
        if (usedMB / limitMB > 0.85 && onPerformanceIssue) {
          console.warn('High memory usage detected!', `${usedMB.toFixed(1)}MB / ${limitMB.toFixed(1)}MB`);
          onPerformanceIssue();
        }
      }
    };

    const memoryInterval = setInterval(checkMemory, 3000); // 3초마다 체크

    return () => {
      clearInterval(memoryInterval);
    };
  }, [onPerformanceIssue]);

  // Canvas 내부에서는 아무것도 렌더링하지 않음
  return null;
};

export default PerformanceMonitor;
