# 🎨 Generative Glitch Art - ✨[바로가기](https://gen-art-glitch.vercel.app)

## 키워드 기반 3D 글리치 아트 생성기 - "불안정한 아름다움"의 디지털 미학을 탐구하는 인터랙티브 웹 애플리케이션

<img width="600" alt="메인화면" src="https://github.com/user-attachments/assets/45fb3e8e-920f-4ace-8fe5-cd4b5ad1cd45" />

<img width="600" alt="로딩화면" src="https://github.com/user-attachments/assets/7a84323d-cc2e-4eef-9580-0fbc79b3baa3" />

<img width="600" alt="소환화면1" src="https://github.com/user-attachments/assets/7e6b44c6-a1d4-45c0-b3be-cc72f5061fa6" />

<img width="600" alt="소환화면2" src="https://github.com/user-attachments/assets/1c3156be-3420-4130-ba5f-0030cf50c299" />

## ✨ 주요 기능

- **키워드 기반 3D 생성**: 입력한 키워드에 따라 고유한 3D 형태가 생성됩니다
- **실시간 글리치 효과**: Perlin noise를 활용한 동적 정점 변형으로 끊임없이 변화하는 글리치 효과
- **네온 색상 시스템**: 마젠타, 시안, 라임 그린의 네온 컬러 팔레트로 사이버펑크 미학 구현
- **포스트 프로세싱**: Bloom과 Noise 효과로 화면이 빛을 발산하는듯한 시각적 임팩트
- **반응형 성능**: 디바이스 성능을 자동 감지하여 최적화된 경험 제공
- **모바일 최적화**: 터치 인터랙션과 성능에 맞춘 적응형 UI

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **3D 렌더링**: Three.js, React Three Fiber
- **포스트 프로세싱**: React Three Postprocessing
- **스타일링**: Tailwind CSS
- **배포**: Vercel

## 🚀 빠른 시작

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

http://localhost:3000에서 확인할 수 있습니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm start
```

## 🎯 사용법

1. 메인 화면에서 원하는 키워드를 입력합니다
2. "Generate Art" 버튼을 클릭합니다
3. 2초간의 글리치 로딩 애니메이션 후 3D 아트가 생성됩니다
4. 마우스나 터치로 시점을 조작하여 다양한 각도에서 감상할 수 있습니다
5. "Reset" 버튼으로 새로운 키워드를 입력할 수 있습니다

## 🎨 디자인 컨셉

### 색상 팔레트
- `#050505` - 매트 블랙 배경
- `#FF00FF` - 마젠타 (주요 글리치 색상)
- `#00FFFF` - 시안 (보조 글리치 색상)
- `#CCFF00` - 라임 그린 (액센트)
- `#CCCCCC` - 라이트 그레이 (UI 텍스트)

### 글리치 효과 원리
1. **정점 변형**: 각 3D 오브젝트의 정점에 Perlin noise 기반 변형을 실시간 적용
2. **색상 순환**: 키워드 해시값 기반 색상 생성 + 시간 기반 변화
3. **위치 점프**: 랜덤한 순간에 오브젝트가 급격히 이동하는 글리치 효과
4. **포스트 프로세싱**: Bloom 효과로 네온 글로우, Noise로 CRT 모니터 느낌

## 📱 반응형 최적화

### 성능 레벨 자동 감지
- **High**: 데스크톱 + 고성능 GPU → 최대 품질
- **Medium**: 일반 데스크톱 → 중간 품질
- **Low**: 모바일 디바이스 → 최소 품질

### 적응형 기능
- 파티클 수 조절 (500~2000개)
- 지오메트리 세분화 조절 (16~64 segments)
- 포스트 프로세싱 효과 선택적 적용
- 조명 수 조절 (모바일: 1개, 데스크톱: 3개)

## 🔧 프로젝트 구조

```
src/
├── app/
│   ├── globals.css          # 글로벌 스타일 + 글리치 애니메이션
│   ├── layout.tsx           # 레이아웃
│   └── page.tsx             # 메인 페이지
├── components/
│   ├── GlitchArtCanvas.tsx  # 3D 캔버스 래퍼
│   ├── GlitchMesh.tsx       # 메인 글리치 3D 오브젝트
│   └── BackgroundParticles.tsx # 배경 파티클 시스템
└── utils/
    └── performance.ts       # 성능 감지 유틸리티
```

## 🎬 영상 시연용 팁

20-30초 쇼츠 영상 제작을 위한 추천 키워드:
- `cyberpunk` - 복잡한 토러스 형태
- `neon` - 밝은 구체 형태
- `glitch` - 불규칙한 원통 형태
- `digital` - 각진 박스 형태
- `art` - 날카로운 원뿔 형태

## 📄 라이센스

MIT License

## 🤝 기여하기

이슈나 풀 리퀘스트는 언제나 환영합니다!
