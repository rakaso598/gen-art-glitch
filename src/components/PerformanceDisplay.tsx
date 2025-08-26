'use client';

import { useState } from 'react';

interface PerformanceDisplayProps {
  fps: number;
}

// Canvas 외부용 FPS 표시
const PerformanceDisplay: React.FC<PerformanceDisplayProps> = ({ fps }) => {
  // 프로덕션에서는 FPS 표시 숨김
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

export default PerformanceDisplay;
