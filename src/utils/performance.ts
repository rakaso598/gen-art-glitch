export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getPerformanceLevel = () => {
  if (typeof window === 'undefined') return 'low'; // 서버사이드는 저성능으로

  // 기본적으로 모바일은 낮은 성능으로 가정
  if (isMobile()) return 'low';

  // 웹 환경에서는 기본적으로 medium으로 시작 (안전한 설정)
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');

    if (!gl) return 'low';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      // 고성능 GPU만 high로 설정
      if (renderer.includes('NVIDIA RTX') || renderer.includes('AMD RX')) return 'high';
      if (renderer.includes('Intel')) return 'low';
    }

    return 'medium';
  } catch (error) {
    // WebGL 오류 시 저성능으로 폴백
    return 'low';
  }
};
