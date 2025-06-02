import WebFont from 'webfontloader';

export interface FontLoadOptions {
  timeout?: number;
  fallback?: string;
}

// 폰트 로딩 상태 추적
let isJalnanLoaded = false;
let fontUpdateBlocked = false;

// 강력한 Jalnan 폰트 로더
export const loadJalnanFont = (options: FontLoadOptions = {}): Promise<boolean> => {
  const { timeout = 10000, fallback = 'Noto Sans KR' } = options;

  return new Promise((resolve) => {
    // 이미 로드된 경우 스킵
    if (isJalnanLoaded) {
      resolve(true);
      return;
    }

    // 1차: WebFont Loader 사용
    WebFont.load({
      custom: {
        families: ['Jalnan', 'JalnanAlt'],
        urls: [
          'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.0/JalnanOTF00.woff2',
          'https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.0/JalnanOTF00.woff2',
          'https://fonts.gstatic.com/ea/jalnan/v1/JalnanOTF.woff2',
        ]
      },
      timeout: timeout,
      active: () => {
        console.log('✅ Jalnan 폰트 로딩 성공 (WebFont Loader)');
        isJalnanLoaded = true;
        fontUpdateBlocked = true; // 추가 업데이트 차단
        resolve(true);
      },
      inactive: () => {
        console.warn('⚠️ WebFont Loader 실패, 다른 방법 시도...');
        if (!isJalnanLoaded) {
          tryAlternativeLoading().then(resolve);
        }
      }
    });

    // 2초 후에만 대안 시도 (너무 빠른 변경 방지)
    setTimeout(() => {
      if (!isJalnanLoaded) {
        tryAlternativeLoading().then(resolve);
      }
    }, 2000);
  });
};

// 대안 로딩 방법들
const tryAlternativeLoading = async (): Promise<boolean> => {
  // 이미 로드되었거나 차단된 경우 스킵
  if (isJalnanLoaded || fontUpdateBlocked) {
    return true;
  }

  // 1. CSS 직접 주입 방법 - 한 번만 실행
  const existingStyle = document.querySelector('#jalnan-force-style');
  if (!existingStyle) {
    const jalnanCSS = `
      @font-face {
        font-family: 'JalnanForce';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.0/JalnanOTF00.woff2') format('woff2'),
             url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.0/JalnanOTF00.woff2') format('woff2'),
             url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.0/JalnanOTF00.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      
      @font-face {
        font-family: 'JalnanGoogleForce';
        src: url('https://fonts.gstatic.com/ea/jalnan/v1/JalnanOTF.woff2') format('woff2'),
             url('https://fonts.gstatic.com/ea/jalnan/v1/JalnanOTF.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.id = 'jalnan-force-style';
    styleEl.textContent = jalnanCSS;
    document.head.appendChild(styleEl);
  }

  // 2. FontFace API 사용 (최신 브라우저) - 조건부 실행
  if ('fonts' in document && !isJalnanLoaded) {
    try {
      const jalnanFont = new FontFace('JalnanAPI', 
        'url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.0/JalnanOTF00.woff2)'
      );
      
      await jalnanFont.load();
      document.fonts.add(jalnanFont);
      
      console.log('✅ Jalnan 폰트 로딩 성공 (FontFace API)');
      isJalnanLoaded = true;
      fontUpdateBlocked = true;
      return true;
    } catch (error) {
      console.warn('⚠️ FontFace API 실패:', error);
    }
  }

  return true;
};

// 폰트 로딩 상태 체크
export const checkFontLoaded = (): boolean => {
  if (!document.fonts) return false;
  
  const fontChecks = [
    'Jalnan',
    'JalnanForce', 
    'JalnanGoogleForce',
    'JalnanAPI',
    'JalnanAlt'
  ];

  const loaded = fontChecks.some(font => document.fonts.check(`16px "${font}"`));
  
  if (loaded && !isJalnanLoaded) {
    isJalnanLoaded = true;
    fontUpdateBlocked = true;
  }
  
  return loaded;
};

// 자동 폰트 로더 (앱 시작시 실행) - 단순화
export const initJalnanFont = async (): Promise<void> => {
  console.log('🎨 Jalnan 폰트 로더 시작...');
  
  try {
    // 초기 상태 확인
    const initialCheck = checkFontLoaded();
    if (initialCheck) {
      console.log('✅ Jalnan 폰트 이미 로드됨');
      return;
    }

    const loaded = await loadJalnanFont({ timeout: 3000 });
    
    if (loaded) {
      console.log('✅ Jalnan 폰트 로딩 완료');
    } else {
      console.warn('⚠️ Jalnan 폰트 로딩 실패, 백업 폰트 사용');
    }

  } catch (error) {
    console.error('❌ 폰트 로더 오류:', error);
  }
}; 