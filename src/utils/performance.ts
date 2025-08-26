export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getPerformanceLevel = () => {
  if (typeof window === 'undefined') return 'low'; // 서버사이드는 저성능으로

  // 기본적으로 모바일은 낮은 성능으로 가정
  if (isMobile()) return 'low';

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;

    if (!gl) return 'low';

    // GPU 메모리 확인
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

    // 기본적으로 medium으로 시작 (안전한 설정)
    let level = 'medium';

    // GPU 정보 확인
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      console.log('GPU Renderer:', renderer);

      // 고성능 GPU 확인
      if (renderer.includes('NVIDIA RTX') || renderer.includes('AMD RX') ||
        renderer.includes('GTX') || renderer.includes('RTX')) {
        level = 'high';
      } else if (renderer.includes('Intel') || renderer.includes('integrated')) {
        level = 'low';
      }
    }

    // 추가 성능 지표 확인
    if (maxTextureSize >= 16384 && maxRenderBufferSize >= 16384) {
      // 고해상도 텍스처 지원시 성능 한 단계 상승
      if (level === 'medium') level = 'high';
    } else if (maxTextureSize < 4096) {
      // 낮은 텍스처 해상도면 성능 하락
      level = 'low';
    }

    // 메모리 정리
    canvas.remove();

    console.log('Performance level detected:', level);
    return level;
  } catch (error) {
    console.warn('Performance detection error:', error);
    // WebGL 오류 시 저성능으로 폴백
    return 'low';
  }
};
