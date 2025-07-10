/**
 * 함수 호출을 지연시키는 디바운스 함수
 * @param func 실행할 함수
 * @param delay 지연 시간 (밀리초)
 * @returns 디바운스된 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    // 이전 타이머가 있으면 취소
    clearTimeout(timeoutId);
    
    // 새 타이머 설정
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Promise를 반환하는 함수용 디바운스
 * @param func 실행할 비동기 함수
 * @param delay 지연 시간 (밀리초)
 * @returns 디바운스된 비동기 함수
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: ReturnType<typeof setTimeout>;
  let latestResolve: ((value: ReturnType<T>) => void) | null = null;
  let latestReject: ((reason: any) => void) | null = null;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      // 이전 프로미스가 있으면 취소
      if (latestResolve) {
        latestReject?.(new Error('Debounced'));
      }

      latestResolve = resolve;
      latestReject = reject;

      // 이전 타이머가 있으면 취소
      clearTimeout(timeoutId);
      
      // 새 타이머 설정
      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          latestResolve?.(result);
        } catch (error) {
          latestReject?.(error);
        } finally {
          latestResolve = null;
          latestReject = null;
        }
      }, delay);
    });
  };
} 