'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Three.js 컴포넌트는 클라이언트 사이드에서만 렌더링
const GlitchArtCanvas = dynamic(
  () => import('../components/GlitchArtCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-[#050505] flex items-center justify-center text-[#CCCCCC]">
        Loading...
      </div>
    )
  }
);

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showArt, setShowArt] = useState(false);
  const [glitchText, setGlitchText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsLoading(true);
    
    // 의미없는 깨진 문자열 애니메이션
    const glitchChars = ['@@!#$#&', '##&*$%', '!!@@##', '&&$$!!', '%%##@@', '@$#&*!'];
    let glitchIndex = 0;
    
    const glitchInterval = setInterval(() => {
      setGlitchText(glitchChars[glitchIndex % glitchChars.length]);
      glitchIndex++;
    }, 150);
    
    // 2초 후 글리치 아트 생성
    setTimeout(() => {
      clearInterval(glitchInterval);
      setIsLoading(false);
      setShowArt(true);
    }, 2000);
  };

  const resetArt = () => {
    setShowArt(false);
    setKeyword('');
    setGlitchText('');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505]">
      {!showArt && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-[#888888] mb-6 md:mb-8 text-center font-mono px-4 glitch-title">
            Generative Glitch Entity
          </h1>
          <p className="text-base md:text-lg text-[#666666] mb-8 md:mb-12 text-center max-w-md font-mono px-4">
            키워드를 입력하여 데이터의 심연에서 솟아나는 섬뜩한 글리치 엔티티를 생성하세요
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 px-4 w-full max-w-md">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="키워드를 입력하세요..."
              className="px-4 md:px-6 py-2 md:py-3 bg-transparent border border-[#666666] text-[#888888] placeholder-[#555555] rounded-none outline-none focus:border-[#311B92] focus:text-[#AAAAAA] transition-colors w-full font-mono text-sm md:text-base glitch-input"
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-6 md:px-8 py-2 md:py-3 bg-transparent border border-[#311B92] text-[#311B92] hover:bg-[#311B92] hover:text-[#050505] hover:shadow-[0_0_10px_#311B92] transition-all duration-300 font-mono text-sm md:text-base glitch-button"
            >
              Summon Entity
            </button>
          </form>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-[#FF00FF] text-2xl font-mono animate-pulse glitch-loading">
            {glitchText || '@@!#$#&'}
          </div>
        </div>
      )}

      {showArt && (
        <>
          <GlitchArtCanvas keyword={keyword} />
          <button
            onClick={resetArt}
            className="absolute top-4 right-4 z-20 px-3 md:px-4 py-1 md:py-2 bg-transparent border border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-[#050505] hover:shadow-[0_0_15px_#FF00FF] transition-all duration-300 font-mono text-sm md:text-base glitch-button"
          >
            Banish
          </button>
          <div className="absolute bottom-4 left-4 z-20 text-[#666666] font-mono text-sm md:text-base">
            Entity: <span className="text-[#311B92] font-bold">{keyword}</span>
          </div>
        </>
      )}
    </div>
  );
}
