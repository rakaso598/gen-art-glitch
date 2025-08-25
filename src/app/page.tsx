'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Three.js 컴포넌트는 클라이언트 사이드에서만 렌더링
const GlitchArtCanvas = dynamic(() => import('@/components/GlitchArtCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-[#050505] flex items-center justify-center text-[#CCCCCC]">
      Loading...
    </div>
  )
}) as React.ComponentType<{ keyword: string }>;

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showArt, setShowArt] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsLoading(true);
    
    // 2초 로딩 효과
    setTimeout(() => {
      setIsLoading(false);
      setShowArt(true);
    }, 2000);
  };

  const resetArt = () => {
    setShowArt(false);
    setKeyword('');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505]">
      {!showArt && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-[#CCCCCC] mb-6 md:mb-8 text-center font-sans px-4">
            Generative Glitch Art
          </h1>
          <p className="text-base md:text-lg text-[#888888] mb-8 md:mb-12 text-center max-w-md font-sans px-4">
            키워드를 입력하여 당신만의 3D 글리치 아트를 생성하세요
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 px-4 w-full max-w-md">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="키워드를 입력하세요..."
              className="px-4 md:px-6 py-2 md:py-3 bg-transparent border border-[#CCCCCC] text-[#CCCCCC] placeholder-[#888888] rounded-none outline-none focus:border-[#FF00FF] transition-colors w-full font-sans text-sm md:text-base"
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-6 md:px-8 py-2 md:py-3 bg-transparent border border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-[#050505] transition-all duration-300 font-sans text-sm md:text-base"
            >
              Generate Art
            </button>
          </form>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="glitch-loader text-[#CCCCCC] text-2xl font-sans">
            Generating...
          </div>
        </div>
      )}

      {showArt && (
        <>
          <GlitchArtCanvas keyword={keyword} />
          <button
            onClick={resetArt}
            className="absolute top-4 right-4 z-20 px-3 md:px-4 py-1 md:py-2 bg-transparent border border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-[#050505] transition-all duration-300 font-sans text-sm md:text-base"
          >
            Reset
          </button>
          <div className="absolute bottom-4 left-4 z-20 text-[#CCCCCC] font-sans text-sm md:text-base">
            Keyword: <span className="text-[#CCFF00]">{keyword}</span>
          </div>
        </>
      )}
    </div>
  );
}
