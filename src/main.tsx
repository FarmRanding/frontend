import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/fonts.css'
import { initJalnanFont } from './utils/fontLoader'

// 🎨 폰트 로더를 가장 먼저 실행
initJalnanFont();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
