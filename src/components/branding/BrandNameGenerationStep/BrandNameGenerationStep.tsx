import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { brandingService, BrandNameRequest } from '../../../api/brandingService';
import iconPencil from '../../../assets/icon-pencil.svg'; // 🔥 NEW: 프로젝트 아이콘 import

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
  allKeywords: string[];
  onBrandNameGenerated: (brandName: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

const BrandNameGenerationStep: React.FC<BrandNameGenerationStepProps> = ({
  allKeywords,
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
  
  // 🔥 NEW: 분할된 키워드들을 상태로 관리 (한 번만 계산)
  const [brandingKeywords, setBrandingKeywords] = useState<string[]>([]);
  const [cropAppealKeywords, setCropAppealKeywords] = useState<string[]>([]);

  // 브랜딩 데이터에서 작물명과 키워드 추출
  const cropName = localStorage.getItem('brandingCropName') || '토마토'; // 기본값
  const variety = localStorage.getItem('brandingVariety') || undefined; // 품종 정보
  
  // 🔥 키워드 분할 로직을 useEffect로 이동 (한 번만 실행)
  useEffect(() => {
    console.log('BrandNameGenerationStep - 전체 키워드:', allKeywords);
    
    let newBrandingKeywords: string[] = [];
    let newCropAppealKeywords: string[] = [];
    
    const totalKeywords = allKeywords.length;
    if (totalKeywords >= 10) {
      // 10개 이상인 경우: 처음 5개를 브랜드 이미지, 다음 5개를 작물 매력으로 사용
      newBrandingKeywords = allKeywords.slice(0, 5);
      newCropAppealKeywords = allKeywords.slice(5, 10);
    } else if (totalKeywords >= 5) {
      // 5-9개인 경우: 절반씩 나누기
      const half = Math.floor(totalKeywords / 2);
      newBrandingKeywords = allKeywords.slice(0, half);
      newCropAppealKeywords = allKeywords.slice(half);
    } else {
      // 5개 미만인 경우: 모든 키워드를 각 타입에 복사
      newBrandingKeywords = [...allKeywords];
      newCropAppealKeywords = [...allKeywords];
    }
    
    // 빈 배열 방지를 위한 기본값 설정
    if (newBrandingKeywords.length === 0) {
      newBrandingKeywords = ['프리미엄', '신선한', '건강한'];
    }
    if (newCropAppealKeywords.length === 0) {
      newCropAppealKeywords = ['달콤한', '맛있는', '영양가 높은'];
    }
    
    setBrandingKeywords(newBrandingKeywords);
    setCropAppealKeywords(newCropAppealKeywords);
    
    console.log('BrandNameGenerationStep - 분할된 키워드:');
    console.log('- brandingKeywords:', newBrandingKeywords);
    console.log('- cropAppealKeywords:', newCropAppealKeywords);
  }, [allKeywords]); // allKeywords가 변경될 때만 실행

  const startGeneration = async () => {
    setStatus('generating');
    setDisplayedName('');
    setIsTyping(false);
    setError('');
    onValidationChange(false);
    
    try {
      // 실제 API 호출로 브랜드명 생성 - 새로운 프롬프트 구조에 맞춤
      const request: BrandNameRequest = {
        cropName,
        variety,  // 품종 정보 추가
        brandingKeywords,  // 브랜드 이미지 키워드
        cropAppealKeywords,  // 작물의 매력 키워드
        previousBrandNames: previousBrandNames // 🔥 NEW: 중복 방지용 이전 브랜드명 목록 추가
      };
      
      console.log('브랜드명 생성 요청 데이터:', request);
      
      // 🔥 NEW: 중복 방지를 위한 재시도 로직 (최대 5번 시도)
      let attempts = 0;
      let newBrandName = '';
      const maxAttempts = 5;
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`브랜드명 생성 시도 ${attempts}/${maxAttempts}`);
        
        const response = await brandingService.generateBrandName(request);
        const candidateBrandName = response.brandName;
        
        // 🔥 NEW: 이전 결과와 동일한지 체크
        if (!previousBrandNames.includes(candidateBrandName)) {
          newBrandName = candidateBrandName;
          console.log('✅ 새로운 브랜드명 생성 성공:', newBrandName);
          break;
        } else {
          console.log('⚠️ 중복된 브랜드명 감지:', candidateBrandName, '- 재시도 중...');
        }
      }
      
      // 🔥 NEW: 모든 시도에서 중복이면 마지막 결과 사용 (조용히 처리)
      if (!newBrandName) {
        const finalResponse = await brandingService.generateBrandName(request);
        newBrandName = finalResponse.brandName;
        console.log('⚠️ 모든 시도에서 중복, 마지막 결과 사용:', newBrandName);
        // 사용자에게는 알리지 않고 조용히 처리
      }
      
      // 🔥 NEW: 생성된 브랜드명을 이전 결과에 추가
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
      
    } catch (error) {
      console.error('브랜드명 생성 실패:', error);
      setError('브랜드명 생성에 실패했습니다. 다시 시도해주세요.');
      setStatus('error');
      
      // 에러 시 fallback 브랜드명 사용
      const fallbackBrandName = generateBrandName(allKeywords);
      setBrandName(fallbackBrandName);
      setStatus('complete');
      onBrandNameGenerated(fallbackBrandName);
      onValidationChange(true);
    }
  };

  useEffect(() => {
    startGeneration();
  }, []);

  const handleRegenerate = () => {
    if (regenerationCount >= 3) {
      setError('브랜드명 재생성은 무료 회원은 3번까지 가능합니다. 더 많은 재생성을 원하시면 멤버십을 업그레이드해주세요.');
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

      {(status === 'complete' || status === 'error') && (
        <RegenerateButton 
          onClick={handleRegenerate} 
          className="regen-button"
          style={{ fontFamily: "'Jalnan 2', sans-serif" }}
        >
          브랜드명 다시 생성하기 ({3 - regenerationCount}회 남음)
        </RegenerateButton>
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