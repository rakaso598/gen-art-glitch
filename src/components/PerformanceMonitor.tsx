'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';

// 개발 환경에서만 FPS 모니터링
const PerformanceMonitor = () => {
  const [fps, setFps] = useState(60);
  const lastTime = useRef(performance.now());
  const frames = useRef(0);

  useFrame(() => {
    frames.current++;
    const now = performance.now();

    if (now - lastTime.current >= 1000) {
      setFps(Math.round((frames.current * 1000) / (now - lastTime.current)));
      frames.current = 0;
      lastTime.current = now;
    }
  });

  // 프로덕션에서는 숨김
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed top-4 left-4 z-50 bg-black/50 text-white px-2 py-1 text-xs font-mono">
      FPS: {fps}
    </div>
  );
};

export default PerformanceMonitor;
