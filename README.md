# 팜랜딩 Frontend

당신의 작물에
브랜딩과 가격을 입히는 경험,

팜랜딩에서 시작하세요.

## 🛠️ 기술 스택

- **Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Language**: TypeScript 5.8.3
- **Styling**: Styled-components 6.1.18
- **Code Quality**: ESLint + Prettier

## 🚀 시작하기

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```
개발 서버는 http://localhost:5174 에서 실행됩니다.

### 빌드
```bash
npm run build
```

### 프리뷰
```bash
npm run preview
```

### 린팅
```bash
npm run lint
```

## 📁 프로젝트 구조

```
src/
├── components/     # 재사용 가능한 컴포넌트
├── pages/         # 페이지 컴포넌트
├── api/           # API 관련 로직
├── utils/         # 유틸리티 함수
├── styles/        # 전역 스타일
└── assets/        # 이미지, 아이콘 등 정적 자원
```

## 🎨 컴포넌트 개발

- styled-components를 사용한 CSS-in-JS 스타일링
- src/components 폴더에 컴포넌트 작성
- src/stories 폴더에 Storybook 파일 작성 (추후 추가 예정)

## 📝 코딩 컨벤션

- TypeScript 사용 필수
- 함수형 컴포넌트 + const 선언 사용
- 이벤트 핸들러는 handle- prefix 사용
- 접근성(a11y) 고려한 컴포넌트 작성
- Early return 패턴 사용
- 설명적인 변수명 사용 