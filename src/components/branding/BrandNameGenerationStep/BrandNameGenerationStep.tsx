import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { brandingService, BrandNameRequest } from '../../../api/brandingService';
import iconPencil from '../../../assets/icon-pencil.svg'; // 🔥 NEW: 프로젝트 아이콘 import
import { getCurrentUser, fetchCurrentUserFromServer } from '../../../api/auth';

// 애니메이션들
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const blinkCursor = keyframes`
  to {
    border-right-color: transparent;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  width: 100%;
  max-width: 320px;
`;

const Title = styled.h1<{ $isVisible: boolean }>`
  font-family: 'Jalnan 2', sans-serif !important;
  font-weight: 400 !important;
  font-size: 24px !important;
  line-height: 1.67 !important;
  letter-spacing: 4.17% !important;
  text-align: center !important;
  color: #000000 !important;
  margin: 0 !important;
  white-space: pre-line !important;
  word-wrap: break-word !important;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.5s ease;
`;

const StatusText = styled.h2<{ $isVisible: boolean }>`
  font-family: 'Jalnan 2', sans-serif !important;
  font-weight: 400 !important;
  font-size: 20px !important;
  line-height: 1.67 !important;
  letter-spacing: 4.17% !important;
  text-align: center !important;
  color: #000000 !important;
  margin: 0 0 24px 0 !important;
  opacity: ${props => props.$isVisible ? 1 : 0};
  animation: ${props => props.$isVisible ? fadeIn : 'none'} 0.8s ease-out;
  transition: opacity 0.5s ease;
`;

const BrandNameContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0px;
`;

const BrandNameCard = styled.div<{ $isVisible: boolean }>`
  width: 280px;
  height: 80px;
  background: #FFFFFF;
  border: 2px solid #1F41BB;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(31, 65, 187, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  transform: ${props => props.$isVisible ? 'scale(1)' : 'scale(0.8)'};
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:hover {
    transform: ${props => props.$isVisible ? 'scale(1.02)' : 'scale(0.8)'};
    box-shadow: 0 6px 20px rgba(31, 65, 187, 0.25);
  }
`;

const BrandNameText = styled.span<{ $isTyping: boolean }>`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 32px;
  line-height: 1.2;
  color: #1F41BB;
  text-align: center;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: visible;
  border-right: ${props => props.$isTyping ? '3px solid #1F41BB' : 'none'};
  animation: ${props => props.$isTyping ? blinkCursor : 'none'} 1s infinite;
`;

// 🔥 NEW: 편집 모드용 입력 필드
const BrandNameInput = styled.input`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 32px;
  line-height: 1.2;
  color: #1F41BB;
  text-align: center;
  background: transparent;
  border: none;
  outline: none;
  width: 90%;
  max-width: 250px;
  display: block;
  margin: 0 auto;
  
  &::placeholder {
    color: rgba(31, 65, 187, 0.5);
    text-align: center;
  }
`;

// 🔥 NEW: 편집 아이콘 (SVG 기반으로 개선)
const EditIcon = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(31, 65, 187, 0.1);
  border: 1px solid rgba(31, 65, 187, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(31, 65, 187, 0.2);
    border-color: rgba(31, 65, 187, 0.3);
    transform: scale(1.05);
  }
  
  ${BrandNameCard}:hover & {
    opacity: 1;
  }
`;

const EditIconImage = styled.img`
  width: 14px;
  height: 14px;
  filter: brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1653%) hue-rotate(221deg) brightness(96%) contrast(91%);
  transition: all 0.3s ease;
  
  ${EditIcon}:hover & {
    transform: scale(1.1);
  }
`;

// 🔥 NEW: 편집 힌트 텍스트
const EditHint = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-top: -20px;
  margin-bottom: 16px;
  opacity: 1;
  transition: opacity 0.3s ease;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-bottom: 24px;
`;

const Dot = styled.div<{ $delay: number }>`
  width: 8px;
  height: 8px;
  background: #1F41BB;
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite;
  animation-delay: ${props => props.$delay}s;
`;

const RegenerateButton = styled.button`
  padding: 12px 24px;
  background: rgba(31, 65, 187, 0.1);
  border: 2px solid #1F41BB;
  border-radius: 8px;
  color: #1F41BB;
  font-family: 'Jalnan 2', sans-serif !important;
  font-weight: 400 !important;
  font-size: 14px !important;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #1F41BB;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(31, 65, 187, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
  padding: 12px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(231, 76, 60, 0.2);
  animation: ${fadeIn} 0.5s ease-out;
`;

// 브랜드명 생성 로직
const generateBrandName = (selectedKeywords: string[]): string => {
  const brandNames = [
    '하은 감자', '순한 토마토', '자연 그대로', '정성 한 스푼',
    '햇살 농원', '청정 들판', '미소 작물', '황금 수확',
    '정직한 농부', '신선한 아침', '건강한 선택', '자연의 선물',
    '풍성한 들판', '깨끗한 자연', '온정 농장', '정성 가득'
  ];
  
  return brandNames[Math.floor(Math.random() * brandNames.length)];
};

type GenerationStatus = 'generating' | 'complete' | 'error';

interface BrandNameGenerationStepProps {
  brandingKeywords: string[];
  cropAppealKeywords: string[];
  onBrandNameGenerated: (brandName: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

const BrandNameGenerationStep: React.FC<BrandNameGenerationStepProps> = ({
  brandingKeywords,
  cropAppealKeywords,
  onBrandNameGenerated,
  onValidationChange
}) => {
  const [status, setStatus] = useState<GenerationStatus>('generating');
  const [brandName, setBrandName] = useState<string>('');
  const [displayedName, setDisplayedName] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string>('');
  const [regenerationCount, setRegenerationCount] = useState(0);
  const [previousBrandNames, setPreviousBrandNames] = useState<string[]>([]);
  // 🔥 NEW: 편집 기능을 위한 상태들
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState<string>('');

  // 🔥 NEW: 멤버십 정보 관리
  const [userMembershipType, setUserMembershipType] = useState<string>('FREE');
  const [maxRegenerations, setMaxRegenerations] = useState<number>(3);

  // 브랜딩 데이터에서 작물명과 키워드 추출
  const cropName = localStorage.getItem('brandingCropName') || '토마토'; // 기본값
  const variety = localStorage.getItem('brandingVariety') || undefined;

  // 🔥 NEW: 멤버십별 제한 설정
  useEffect(() => {
    const loadUserMembershipInfo = async () => {
      try {
        // 서버에서 최신 사용자 정보 가져오기
        const currentUser = await fetchCurrentUserFromServer();
        console.log('🔍 서버에서 가져온 현재 사용자 정보:', currentUser);
        
        if (currentUser) {
          console.log('🔍 멤버십 타입:', currentUser.membershipType);
          
          // 🔥 백엔드에서 enum으로 올 수 있으므로 문자열로 변환
          const membershipTypeStr = typeof currentUser.membershipType === 'string' 
            ? currentUser.membershipType 
            : currentUser.membershipType?.toString() || 'FREE';
          
          console.log('🔍 변환된 멤버십 타입:', membershipTypeStr);
          setUserMembershipType(membershipTypeStr);
          
          // 멤버십별 재생성 제한 설정
          if (membershipTypeStr === 'PREMIUM_PLUS' || membershipTypeStr === 'PREMIUM') {
            console.log('✅ 프리미엄/프리미엄 플러스 멤버십: 10회 제한 설정');
            setMaxRegenerations(10);
          } else {
            console.log('✅ 일반 멤버십: 3회 제한 설정');
            setMaxRegenerations(3);
          }
        } else {
          console.log('⚠️ 서버에서 사용자 정보를 가져올 수 없습니다. 로컬 스토리지 정보 사용');
          // 에러 시 로컬 스토리지 정보 사용
          const localUser = getCurrentUser();
          if (localUser) {
            console.log('🔍 로컬 멤버십 타입:', localUser.membershipType);
            
            const membershipTypeStr = typeof localUser.membershipType === 'string' 
              ? localUser.membershipType 
              : localUser.membershipType?.toString() || 'FREE';
              
            setUserMembershipType(membershipTypeStr);
            if (membershipTypeStr === 'PREMIUM_PLUS' || membershipTypeStr === 'PREMIUM') {
              setMaxRegenerations(10);
            } else {
              setMaxRegenerations(3);
            }
          } else {
            console.log('⚠️ 사용자 정보가 없습니다. 기본값 FREE로 설정');
            setUserMembershipType('FREE');
            setMaxRegenerations(3);
          }
        }
      } catch (error) {
        console.error('❌ 사용자 정보 로드 실패:', error);
        // 에러 시 로컬 스토리지 정보 사용
        const localUser = getCurrentUser();
        if (localUser) {
          const membershipTypeStr = typeof localUser.membershipType === 'string' 
            ? localUser.membershipType 
            : localUser.membershipType?.toString() || 'FREE';
            
          setUserMembershipType(membershipTypeStr);
          if (membershipTypeStr === 'PREMIUM_PLUS' || membershipTypeStr === 'PREMIUM') {
            setMaxRegenerations(10);
          } else {
            setMaxRegenerations(3);
          }
        } else {
          setUserMembershipType('FREE');
          setMaxRegenerations(3);
        }
      }
    };
    
    loadUserMembershipInfo();
  }, []);

  const startGeneration = async () => {
    // 🔥 키워드 검증
    if (brandingKeywords.length === 0) {
      console.log('⏳ 브랜딩 키워드가 없음, 대기 중...');
      return;
    }
    
    setStatus('generating');
    setDisplayedName('');
    setIsTyping(false);
    setError('');
    onValidationChange(false);
    
    try {
      // 실제 API 호출로 브랜드명 생성
      const request: BrandNameRequest = {
        cropName,
        variety,
        brandingKeywords,
        cropAppealKeywords,
        previousBrandNames,
        regenerationCount // 🔥 NEW: 재생성 횟수 전달
      };
      
      console.log('🚀 브랜드명 생성 요청 데이터:', request);
      console.log('🔍 현재 재생성 횟수:', regenerationCount);
      console.log('🔍 최대 재생성 횟수:', maxRegenerations);
      console.log('🔍 사용자 멤버십:', userMembershipType);
      
      // 🔥 중복 방지를 위한 재시도 로직 (최대 5번 시도)
      let attempts = 0;
      let newBrandName = '';
      const maxAttempts = 5;
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`브랜드명 생성 시도 ${attempts}/${maxAttempts}`);
        
        const response = await brandingService.generateBrandName(request);
        const candidateBrandName = response.brandName;
        
        // 🔥 이전 결과와 동일한지 체크
        if (!previousBrandNames.includes(candidateBrandName)) {
          newBrandName = candidateBrandName;
          console.log('✅ 새로운 브랜드명 생성 성공:', newBrandName);
          break;
        } else {
          console.log('⚠️ 중복된 브랜드명 감지:', candidateBrandName, '- 재시도 중...');
        }
      }
      
      // 🔥 모든 시도에서 중복이면 마지막 결과 사용
      if (!newBrandName) {
        const finalResponse = await brandingService.generateBrandName(request);
        newBrandName = finalResponse.brandName;
        console.log('⚠️ 모든 시도에서 중복, 마지막 결과 사용:', newBrandName);
      }
      
      // 🔥 생성된 브랜드명을 이전 결과에 추가
      setPreviousBrandNames(prev => [...prev, newBrandName]);
      
      setBrandName(newBrandName);
      setStatus('complete');
      onBrandNameGenerated(newBrandName);
      onValidationChange(true);
      
      // 타이핑 애니메이션 시작
      setTimeout(() => {
        setIsTyping(true);
        let index = 0;
        const typeInterval = setInterval(() => {
          if (index < newBrandName.length) {
            setDisplayedName(newBrandName.slice(0, index + 1));
            index++;
          } else {
            setIsTyping(false);
            clearInterval(typeInterval);
          }
        }, 150);
      }, 500);
      
    } catch (error: any) {
      console.error('브랜드명 생성 실패:', error);
      
      // 🔥 NEW: 멤버십별 제한 초과 에러 처리
      if (error.response?.data?.code === 'FR404') {
        const membershipName = userMembershipType === 'PREMIUM_PLUS' || userMembershipType === 'PREMIUM' ? '프리미엄/프리미엄 플러스' : '일반';
        setError(`브랜드명 재생성은 ${membershipName} 멤버십은 ${maxRegenerations}번까지 가능합니다. ${userMembershipType === 'FREE' ? '더 많은 재생성을 원하시면 멤버십을 업그레이드해주세요.' : ''}`);
      } else {
        setError('브랜드명 생성에 실패했습니다. 다시 시도해주세요.');
      }
      
      setStatus('error');
      
      // 에러 시 fallback 브랜드명 사용 (제한 초과가 아닌 경우만)
      if (error.response?.data?.code !== 'FR404') {
        const fallbackBrandName = generateBrandName(brandingKeywords.concat(cropAppealKeywords));
        setBrandName(fallbackBrandName);
        setStatus('complete');
        onBrandNameGenerated(fallbackBrandName);
        onValidationChange(true);
      }
    }
  };

  useEffect(() => {
    // 🔥 키워드가 있으면 바로 브랜드명 생성 시작
    if (brandingKeywords.length > 0) {
      console.log('✅ 키워드 준비 완료, 브랜드명 생성 시작');
      console.log('- brandingKeywords:', brandingKeywords);
      console.log('- cropAppealKeywords:', cropAppealKeywords);
      startGeneration();
    }
  }, []); // 마운트 시 한 번만 실행

  const handleRegenerate = () => {
    // 🔥 NEW: 멤버십별 재생성 제한 체크
    if (regenerationCount >= maxRegenerations) {
      const membershipName = userMembershipType === 'PREMIUM_PLUS' || userMembershipType === 'PREMIUM' ? '프리미엄/프리미엄 플러스' : '일반';
      setError(`브랜드명 재생성은 ${membershipName} 멤버십은 ${maxRegenerations}번까지 가능합니다. ${userMembershipType === 'FREE' ? '더 많은 재생성을 원하시면 멤버십을 업그레이드해주세요.' : ''}`);
      return;
    }
    
    setRegenerationCount(prev => prev + 1);
    startGeneration();
  };

  // 🔥 NEW: 브랜드명 편집 시작
  const handleStartEdit = () => {
    setIsEditing(true);
    setEditingValue(brandName);
  };

  // 🔥 NEW: 브랜드명 편집 저장
  const handleSaveEdit = () => {
    const trimmedValue = editingValue.trim();
    if (trimmedValue && trimmedValue !== brandName) {
      setBrandName(trimmedValue);
      setDisplayedName(trimmedValue);
      onBrandNameGenerated(trimmedValue);
      // 수정된 브랜드명도 이전 목록에 추가
      setPreviousBrandNames(prev => [...prev, trimmedValue]);
      console.log('✏️ 브랜드명 수동 편집 완료:', trimmedValue);
    }
    setIsEditing(false);
  };

  // 🔥 NEW: 브랜드명 편집 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingValue(brandName);
  };

  // 🔥 NEW: 편집 입력 필드 키 이벤트 처리
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // 🔥 NEW: 동적 버튼 텍스트 생성
  const getRegenerateButtonText = () => {
    const remaining = maxRegenerations - regenerationCount;
    const membershipName = userMembershipType === 'PREMIUM_PLUS' || userMembershipType === 'PREMIUM' ? '프리미엄/프리미엄 플러스' : '일반';
    return `브랜드명 다시 생성하기 (${remaining}회 남음)`;
  };

  return (
    <Container>
      <Title 
        $isVisible={status === 'generating'} 
        className="brand-title"
        style={{ fontFamily: "'Jalnan 2', sans-serif" }}
      >
        {status === 'generating' && (
          <>
            브랜드명을 생성하고<br />있습니다.
          </>
        )}
      </Title>
      
      <StatusText 
        $isVisible={status === 'complete'} 
        className="status-text"
        style={{ fontFamily: "'Jalnan 2', sans-serif" }}
      >
        브랜드명이 만들어졌어요!
      </StatusText>

      {error && (
        <ErrorText style={{ fontFamily: "'Jalnan 2', sans-serif" }}>
          {error}
        </ErrorText>
      )}

      <BrandNameContainer>
        {status === 'generating' ? (
          <LoadingDots>
            <Dot $delay={0} />
            <Dot $delay={0.2} />
            <Dot $delay={0.4} />
          </LoadingDots>
        ) : (
          <BrandNameCard 
            $isVisible={status === 'complete'} 
            onClick={!isEditing ? handleStartEdit : undefined}
          >
            {isEditing ? (
              <BrandNameInput
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={handleSaveEdit}
                placeholder="브랜드명을 입력하세요"
                autoFocus
                maxLength={20}
              />
            ) : (
              <BrandNameText $isTyping={isTyping}>
                {displayedName}
              </BrandNameText>
            )}
            
            {!isEditing && status === 'complete' && (
              <EditIcon>
                <EditIconImage src={iconPencil} alt="Edit Icon" />
              </EditIcon>
            )}
          </BrandNameCard>
        )}
      </BrandNameContainer>

      {/* 🔥 MOVED: 편집 가이드를 아래쪽으로 이동 */}
      {!isEditing && status === 'complete' && (
        <EditHint>클릭하여 브랜드명을 수정할 수 있어요</EditHint>
      )}

      {(status === 'complete' || status === 'error') && regenerationCount < maxRegenerations && (
        <RegenerateButton 
          onClick={handleRegenerate} 
          className="regen-button"
          style={{ fontFamily: "'Jalnan 2', sans-serif" }}
        >
          {getRegenerateButtonText()}
        </RegenerateButton>
      )}
      
      {/* 🔥 NEW: 제한 도달 시 멤버십 업그레이드 안내 */}
      {regenerationCount >= maxRegenerations && userMembershipType === 'FREE' && (
        <div style={{ 
          marginTop: '16px', 
          fontSize: '12px', 
          color: '#1F41BB', 
          textAlign: 'center',
          fontFamily: "'Inter', sans-serif",
          padding: '12px',
          background: 'rgba(31, 65, 187, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(31, 65, 187, 0.2)'
        }}>
          💡 프리미엄/프리미엄 플러스 멤버십으로 업그레이드하면 브랜드명을 10번까지 재생성할 수 있어요!
        </div>
      )}
      
      {/* 🔥 NEW: 이전 생성된 브랜드명들 표시 (디버깅용, 나중에 제거 가능) */}
      {previousBrandNames.length > 1 && (
        <div style={{ 
          marginTop: '16px', 
          fontSize: '12px', 
          color: '#666', 
          textAlign: 'center',
          fontFamily: "'Inter', sans-serif"
        }}>
          이전 생성: {previousBrandNames.slice(0, -1).join(', ')}
        </div>
      )}
    </Container>
  );
};

export default BrandNameGenerationStep; 