'use client';

import { useState, useEffect } from 'react';
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
  const [glitchText, setGlitchText] = useState('@@!#$#&'); // 초기값을 고정으로 설정
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true);

    // 에러 처리
    const handleError = (event: ErrorEvent) => {
      console.error('Application error:', event.error);
      setError('렌더링 오류가 발생했습니다. 페이지를 새로고침하세요.');
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

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
    try {
      setShowArt(false);
      setKeyword('');
      setGlitchText('@@!#$#&'); // 초기값으로 리셋
      setError(null); // 에러도 리셋
    } catch (err) {
      console.error('Reset error:', err);
      setError('리셋 중 오류가 발생했습니다.');
    }
  };

  // 클라이언트 사이드에서만 렌더링
  if (!isClient) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-[#888888] mb-6 md:mb-8 text-center font-mono px-4 glitch-title">
            Generative Glitch Entity
          </h1>
          <p className="text-base md:text-lg text-[#666666] mb-8 md:mb-12 text-center max-w-md font-mono px-4">
            키워드를 입력하여 데이터의 심연에서 솟아나는 섬뜩한 글리치 엔티티를 생성하세요
          </p>
          <div className="flex flex-col items-center gap-4 px-4 w-full max-w-md">
            <div className="px-4 md:px-6 py-2 md:py-3 bg-transparent border border-[#666666] text-[#888888] placeholder-[#555555] rounded-none outline-none w-full font-mono text-sm md:text-base">
              키워드를 입력하세요...
            </div>
            <div className="px-6 md:px-8 py-2 md:py-3 bg-transparent border border-[#311B92] text-[#311B92] font-mono text-sm md:text-base">
              Summon Entity
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505]">
      {/* 에러 메시지 표시 */}
      {error && (
        <div className="performance-warning">
          <h3>⚠️ 오류 발생</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-white text-red-600 rounded"
          >
            새로고침
          </button>
        </div>
      )}

      {!showArt && !isLoading && !error && (
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

      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-[#FF00FF] text-2xl font-mono animate-pulse glitch-loading">
            {glitchText}
          </div>
        </div>
      )}

      {showArt && !error && (
        <>
          <GlitchArtCanvas keyword={keyword} />
          {/* 더 눈에 띄는 RESET 버튼 */}
          <button
            onClick={resetArt}
            className="absolute top-4 right-4 z-30 px-4 md:px-6 py-2 md:py-3 bg-[#FF0000] border-2 border-[#FF0000] text-white hover:bg-[#CC0000] hover:border-[#CC0000] hover:shadow-[0_0_20px_#FF0000] transition-all duration-300 font-mono text-sm md:text-base font-bold glitch-button uppercase tracking-wider"
            style={{
              boxShadow: '0 0 10px rgba(255, 0, 0, 0.5), inset 0 0 5px rgba(255, 255, 255, 0.2)',
              textShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
            }}
          >
            🔥 RESET 🔥
          </button>
          {/* 엔티티 정보 패널 */}
          <div className="absolute bottom-4 left-4 z-20 bg-black bg-opacity-70 p-3 border border-[#666666] text-[#666666] font-mono text-sm md:text-base entity-flash">
            <div className="text-[#FF0000] font-bold mb-1">⚠️ ENTITY SUMMONED ⚠️</div>
            <div>Target: <span className="text-[#FF00FF] font-bold glitch-text">{keyword}</span></div>
            <div className="text-xs text-[#555] mt-1">Press RESET to banish</div>
          </div>
        </>
      )}
    </div>
  );
}
