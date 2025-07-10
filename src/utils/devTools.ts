/**
 * 신규 유저 테스트를 위한 개발자 도구 함수들
 * 
 * 사용법:
 * 1. 브라우저 콘솔에서 window.devTools.simulateNewUser() 실행
 * 2. 신규 유저 플로우 테스트
 * 3. window.devTools.restoreOriginalUser() 실행하여 원상복구
 */

interface UserBackup {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  email: string | null;
  nickname: string | null;
  membershipType: string | null;
  name: string | null;
  farmName: string | null;
  location: string | null;
}

interface DevTools {
  simulateNewUser: () => void;
  restoreOriginalUser: () => void;
  clearAllUserData: () => void;
  simulateLogin: (userData: any) => void;
  showBackupData: () => void;
  triggerSignupModal: () => void;
  hasBackup: () => boolean;
  createNewUserDirectly: () => void;
  simulateOAuthReturn: (isNewUser?: boolean) => void;
}

class DevToolsClass {
  private static readonly BACKUP_KEY = 'DEV_USER_BACKUP';
  private static readonly TEST_USER_KEY = 'DEV_TEST_MODE';
  private static readonly FORCE_NEW_USER_KEY = 'DEV_FORCE_NEW_USER';

  /**
   * 가짜 JWT 토큰 생성 (형식만 맞춤, 실제 검증은 안됨)
   */
  private generateFakeJWT(): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      sub: 'dev-user', 
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      dev: true 
    }));
    const signature = btoa('dev-signature-' + Date.now());
    return `${header}.${payload}.${signature}`;
  }

  /**
   * 현재 사용자 데이터를 백업하고 신규 사용자로 시뮬레이션
   */
  simulateNewUser(): void {
    console.log('🔧 개발 도구: 신규 유저 시뮬레이션 시작');
    
    // 현재 사용자 데이터 백업
    this.backupCurrentUser();
    
    // 모든 사용자 관련 데이터 제거
    this.clearUserData();
    
    // 테스트 모드 플래그 설정
    localStorage.setItem(DevToolsClass.TEST_USER_KEY, 'true');
    localStorage.setItem(DevToolsClass.FORCE_NEW_USER_KEY, 'true');
    
    console.log('✅ 신규 유저 시뮬레이션 완료');
    console.log('💡 이제 소셜 로그인을 하면 강제로 신규 유저 플로우가 실행됩니다');
    console.log('🎯 또는 window.devTools.createNewUserDirectly()로 바로 신규 유저 생성');
    console.log('🔄 원상복구하려면: window.devTools.restoreOriginalUser()');
    
    // 페이지 새로고침으로 AuthContext 상태 초기화
    window.location.reload();
  }

  /**
   * OAuth 로그인 완료 상태를 시뮬레이션 (실제 로그인 없이)
   */
  simulateOAuthReturn(isNewUser: boolean = true): void {
    console.log('🔧 개발 도구: OAuth 로그인 완료 시뮬레이션');
    
    const fakeUserId = 'dev-' + Date.now();
    const fakeAccessToken = this.generateFakeJWT();
    const fakeRefreshToken = this.generateFakeJWT();
    
    // OAuth 완료 후 리다이렉트 URL 시뮬레이션
    const params = new URLSearchParams({
      accessToken: fakeAccessToken,
      refreshToken: fakeRefreshToken,
      userId: fakeUserId,
      email: 'dev-test@farmranding.com',
      nickname: '개발테스트유저',
      membershipType: 'FREE',
      isNewUser: isNewUser.toString()
    });
    
    // 강제 신규 유저 모드 설정 (서버에서 기존 유저라고 해도 신규로 처리)
    if (isNewUser) {
      localStorage.setItem(DevToolsClass.FORCE_NEW_USER_KEY, 'true');
    }
    
    console.log('🎯 OAuth 시뮬레이션 완료, 페이지 이동 중...');
    window.location.href = `/?${params.toString()}`;
  }

  /**
   * 직접 신규 유저 생성 (OAuth 없이 바로 회원가입 모달)
   */
  createNewUserDirectly(): void {
    console.log('🔧 개발 도구: 직접 신규 유저 생성');
    
    this.simulateOAuthReturn(true);
  }

  /**
   * 기존 사용자로 로그인 시뮬레이션
   */
  simulateExistingUser(): void {
    console.log('🔧 개발 도구: 기존 사용자 로그인 시뮬레이션');
    
    this.simulateOAuthReturn(false);
  }

  /**
   * 백업된 사용자 데이터로 복구
   */
  restoreOriginalUser(): void {
    console.log('🔧 개발 도구: 원본 사용자 복구 시작');
    
    const backupData = this.getBackupData();
    if (!backupData) {
      console.warn('⚠️ 백업된 사용자 데이터가 없습니다');
      return;
    }
    
    // 테스트 모드 플래그 제거
    localStorage.removeItem(DevToolsClass.TEST_USER_KEY);
    localStorage.removeItem(DevToolsClass.FORCE_NEW_USER_KEY);
    
    // 백업 데이터 복원
    Object.entries(backupData).forEach(([key, value]) => {
      if (value !== null) {
        localStorage.setItem(key, value);
      }
    });
    
    // 백업 데이터 제거
    localStorage.removeItem(DevToolsClass.BACKUP_KEY);
    
    console.log('✅ 원본 사용자 복구 완료');
    console.log('🔄 페이지가 새로고침됩니다');
    
    // 페이지 새로고침으로 AuthContext 상태 초기화
    window.location.reload();
  }

  /**
   * 현재 사용자 데이터 백업
   */
  private backupCurrentUser(): void {
    const backup: UserBackup = {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      userId: localStorage.getItem('userId'),
      email: localStorage.getItem('email'),
      nickname: localStorage.getItem('nickname'),
      membershipType: localStorage.getItem('membershipType'),
      name: localStorage.getItem('name'),
      farmName: localStorage.getItem('farmName'),
      location: localStorage.getItem('location'),
    };
    
    localStorage.setItem(DevToolsClass.BACKUP_KEY, JSON.stringify(backup));
    console.log('💾 사용자 데이터 백업 완료');
  }

  /**
   * 백업 데이터 조회
   */
  private getBackupData(): UserBackup | null {
    const backupStr = localStorage.getItem(DevToolsClass.BACKUP_KEY);
    if (!backupStr) return null;
    
    try {
      return JSON.parse(backupStr);
    } catch (e) {
      console.error('백업 데이터 파싱 오류:', e);
      return null;
    }
  }

  /**
   * 모든 사용자 데이터 제거
   */
  private clearUserData(): void {
    const userKeys = [
      'accessToken',
      'refreshToken', 
      'userId',
      'email',
      'nickname',
      'membershipType',
      'name',
      'farmName',
      'location'
    ];
    
    userKeys.forEach(key => localStorage.removeItem(key));
  }

  /**
   * 모든 사용자 데이터 완전 제거 (백업 포함)
   */
  clearAllUserData(): void {
    console.log('🗑️ 모든 사용자 데이터 삭제 중...');
    
    this.clearUserData();
    localStorage.removeItem(DevToolsClass.BACKUP_KEY);
    localStorage.removeItem(DevToolsClass.TEST_USER_KEY);
    localStorage.removeItem(DevToolsClass.FORCE_NEW_USER_KEY);
    
    console.log('✅ 모든 사용자 데이터 삭제 완료');
    window.location.reload();
  }

  /**
   * 특정 사용자 데이터로 로그인 시뮬레이션 (레거시)
   */
  simulateLogin(userData: {
    userId: string;
    email: string;
    nickname: string;
    membershipType?: string;
    isNewUser?: boolean;
  }): void {
    console.log('🔧 개발 도구: 로그인 시뮬레이션');
    
    // JWT 형식 토큰 생성
    const fakeAccessToken = this.generateFakeJWT();
    const fakeRefreshToken = this.generateFakeJWT();
    
    localStorage.setItem('accessToken', fakeAccessToken);
    localStorage.setItem('refreshToken', fakeRefreshToken);
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('nickname', userData.nickname);
    localStorage.setItem('membershipType', userData.membershipType || 'FREE');
    
    if (userData.isNewUser) {
      // 신규 유저로 시뮬레이션 - 홈 페이지로 가서 회원가입 모달 표시
      localStorage.setItem(DevToolsClass.FORCE_NEW_USER_KEY, 'true');
      const params = new URLSearchParams({
        accessToken: fakeAccessToken,
        refreshToken: fakeRefreshToken,
        userId: userData.userId,
        email: userData.email,
        nickname: userData.nickname,
        membershipType: userData.membershipType || 'FREE',
        isNewUser: 'true'
      });
      
      window.location.href = `/?${params.toString()}`;
    } else {
      // 기존 유저로 시뮬레이션
      window.location.href = '/home';
    }
  }

  /**
   * 백업 데이터 확인
   */
  showBackupData(): void {
    const backup = this.getBackupData();
    const testMode = localStorage.getItem(DevToolsClass.TEST_USER_KEY);
    const forceNewUser = localStorage.getItem(DevToolsClass.FORCE_NEW_USER_KEY);
    
    console.log('📊 개발 도구 상태:');
    console.log('- 테스트 모드:', testMode ? 'ON' : 'OFF');
    console.log('- 강제 신규 모드:', forceNewUser ? 'ON' : 'OFF');
    console.log('- 백업 존재:', !!backup);
    
    if (backup) {
      console.log('💾 백업된 사용자 데이터:');
      console.table(backup);
    }
    
    console.log('🔧 현재 localStorage:');
    const currentData = {
      accessToken: localStorage.getItem('accessToken')?.substring(0, 20) + '...',
      userId: localStorage.getItem('userId'),
      email: localStorage.getItem('email'),
      nickname: localStorage.getItem('nickname'),
    };
    console.table(currentData);
  }

  /**
   * 회원가입 모달 강제 표시 (현재 페이지에서)
   */
  triggerSignupModal(): void {
    console.log('🔧 개발 도구: 회원가입 모달 표시');
    
    // 강제 신규 유저 모드 설정
    localStorage.setItem(DevToolsClass.FORCE_NEW_USER_KEY, 'true');
    
    // 현재 URL에 신규 유저 파라미터 추가
    const currentUrl = new URL(window.location.href);
    const fakeAccessToken = this.generateFakeJWT();
    const fakeRefreshToken = this.generateFakeJWT();
    
    currentUrl.searchParams.set('accessToken', fakeAccessToken);
    currentUrl.searchParams.set('refreshToken', fakeRefreshToken);
    currentUrl.searchParams.set('userId', 'dev-999');
    currentUrl.searchParams.set('email', 'test@farmranding.dev');
    currentUrl.searchParams.set('nickname', '테스트유저');
    currentUrl.searchParams.set('membershipType', 'FREE');
    currentUrl.searchParams.set('isNewUser', 'true');
    
    window.history.pushState({}, '', currentUrl.toString());
    window.location.reload();
  }

  /**
   * 백업 데이터 존재 여부 확인
   */
  hasBackup(): boolean {
    return !!this.getBackupData();
  }

  /**
   * 강제 신규 유저 모드인지 확인
   */
  isForceNewUserMode(): boolean {
    return localStorage.getItem(DevToolsClass.FORCE_NEW_USER_KEY) === 'true';
  }

  /**
   * 개발 모드 상태 리셋
   */
  resetDevMode(): void {
    localStorage.removeItem(DevToolsClass.TEST_USER_KEY);
    localStorage.removeItem(DevToolsClass.FORCE_NEW_USER_KEY);
    console.log('🔄 개발 모드 상태 리셋 완료');
  }
}

// 전역 개발 도구 인스턴스 생성
const devTools = new DevToolsClass();

// 개발 환경에서만 window 객체에 추가
if (import.meta.env.DEV) {
  (window as any).devTools = devTools;
  
  console.log('🛠️ 개발자 도구가 로드되었습니다!');
  console.log('📖 사용 가능한 함수들:');
  console.log('- window.devTools.simulateNewUser()     : 신규 유저 시뮬레이션');
  console.log('- window.devTools.createNewUserDirectly(): 바로 신규 유저 생성');
  console.log('- window.devTools.simulateExistingUser() : 기존 유저로 로그인');
  console.log('- window.devTools.restoreOriginalUser() : 원본 사용자 복구');
  console.log('- window.devTools.showBackupData()      : 백업 데이터 확인');
  console.log('- window.devTools.clearAllUserData()    : 모든 데이터 삭제');
  console.log('- window.devTools.triggerSignupModal()  : 회원가입 모달 표시');
  console.log('- window.devTools.hasBackup()           : 백업 존재 여부 확인');
  console.log('');
  console.log('🎯 추천 사용법:');
  console.log('1. window.devTools.createNewUserDirectly() - OAuth 없이 바로 신규 유저 테스트');
  console.log('2. window.devTools.simulateNewUser() - 완전한 신규 유저 시뮬레이션');  
  console.log('3. window.devTools.restoreOriginalUser() - 원상복구');
}

export default devTools; 