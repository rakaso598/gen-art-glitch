export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getPerformanceLevel = () => {
  if (typeof window === 'undefined') return 'high';
  
  // 기본적으로 모바일은 낮은 성능으로 가정
  if (isMobile()) return 'low';
  
  // GPU 정보를 통한 성능 추정 (간단한 구현)
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  
  if (!gl) return 'low';
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    if (renderer.includes('Intel')) return 'medium';
    if (renderer.includes('NVIDIA') || renderer.includes('AMD')) return 'high';
  }
  
  return 'medium';
};
