import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/fonts.css'
import { initJalnanFont } from './utils/fontLoader'

// 🛠️ 개발 환경에서 개발자 도구 로드
if (import.meta.env.DEV) {
  import('./utils/devTools');
}

// 🎨 폰트 로더를 가장 먼저 실행
initJalnanFont();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
