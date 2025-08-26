'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';

interface PerformanceMonitorProps {
  onPerformanceIssue?: () => void;
}

// 개발 환경에서만 FPS 모니터링 + 성능 문제 감지
const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ onPerformanceIssue }) => {
  const [fps, setFps] = useState(60);
  const lastTime = useRef(performance.now());
  const frames = useRef(0);
  const fpsHistoryRef = useRef<number[]>([]);
  const performanceIssueCountRef = useRef(0);

  useFrame(() => {
    frames.current++;
    const now = performance.now();

    if (now - lastTime.current >= 1000) {
      const currentFps = Math.round((frames.current * 1000) / (now - lastTime.current));
      setFps(currentFps);

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
        const memory = (performance as any).memory;
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

  // 프로덕션에서는 FPS 표시 숨김 (성능 모니터링은 계속)
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed top-4 left-4 z-50 bg-black/70 text-white px-3 py-2 text-xs font-mono border border-gray-600">
      <div>FPS: {fps}</div>
      <div className={fps < 20 ? 'text-red-400' : fps < 40 ? 'text-yellow-400' : 'text-green-400'}>
        Status: {fps < 20 ? 'Poor' : fps < 40 ? 'Fair' : 'Good'}
      </div>
    </div>
  );
};

export default PerformanceMonitor;
