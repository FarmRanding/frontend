import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import ProductInput, { ProductInputData } from '../../common/ProductInput/ProductInput';
import DatePicker from '../../common/DatePicker/DatePicker';
import GradeSelector from '../../common/GradeSelector/GradeSelector';
import iconCalendar from '../../../assets/icon-calendar.svg';
import iconGrade from '../../../assets/icon-grade.svg';

// 애니메이션
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

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  width: 100%;
  max-width: 500px;
  padding: 0 20px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 1.67;
  letter-spacing: 4.17%;
  text-align: center;
  color: #000000;
  margin: 0;
  white-space: pre-line;
  animation: ${fadeIn} 0.8s ease-out;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  animation: ${slideInUp} 0.8s ease-out 0.2s both;
`;

const GradeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Label = styled.label`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #000000;
`;

const GradeInput = styled.div<{ hasValue: boolean }>`
  width: 100%;
  height: 33px;
  background: #FFFFFF;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.21;
  color: ${props => props.hasValue ? '#000000' : '#9C9C9C'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0px 8px 24px 0px rgba(31, 65, 187, 0.2);
    transform: translateY(-1px);
  }
`;

const GradeIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(7500%) hue-rotate(75deg) brightness(98%) contrast(100%);
  transition: all 0.3s ease;

  ${GradeInput}:hover & {
    filter: brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1653%) hue-rotate(221deg) brightness(96%) contrast(91%);
    transform: scale(1.1);
  }
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const DateInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DateInput = styled.div<{ hasValue: boolean }>`
  width: 100%;
  height: 33px;
  background: #FFFFFF;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.21;
  color: ${props => props.hasValue ? '#000000' : '#9C9C9C'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0px 8px 24px 0px rgba(31, 65, 187, 0.2);
    transform: translateY(-1px);
  }
`;

const CalendarIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(7500%) hue-rotate(75deg) brightness(98%) contrast(100%);
  transition: all 0.3s ease;

  ${DateInput}:hover & {
    filter: brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1653%) hue-rotate(221deg) brightness(96%) contrast(91%);
    transform: scale(1.1);
  }
`;

const PriceCheckButton = styled.button`
  width: 100%;
  max-width: 300px;
  padding: 15px;
  background: #1F41BB;
  border: none;
  border-radius: 8px;
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #FFFFFF;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  align-self: center;

  &:hover {
    background: #1a37a0;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(31, 65, 187, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(31, 65, 187, 0.2);
  }
`;

interface PriceQuoteData {
  productId: number | null;
  garakCode: string;
  productName: string;
  grade: string;
  harvestDate: Date | null;
}

interface PriceQuoteStepProps {
  data: PriceQuoteData;
  onChange: (data: Partial<PriceQuoteData>) => void;
  onValidationChange: (isValid: boolean) => void;
  onPriceGenerated: (price: number) => void;
}

const PriceQuoteStep: React.FC<PriceQuoteStepProps> = ({
  data,
  onChange,
  onValidationChange,
  onPriceGenerated
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGradeSelectorOpen, setIsGradeSelectorOpen] = useState(false);

  const handleProductChange = (productData: ProductInputData) => {
    onChange({
      productId: productData.productId,
      garakCode: productData.garakCode,
      productName: productData.productName
    });
  };

  const handleDateSelect = (date: Date) => {
    onChange({ harvestDate: date });
    setIsDatePickerOpen(false);
  };

  const handleGradeSelect = (grade: string) => {
    onChange({ grade });
    setIsGradeSelectorOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const getGradeDisplayText = () => {
    if (!data.grade) return '-';
    
    const gradeMap: { [key: string]: string } = {
      '특': '특급 (최고급)',
      '상': '상급 (우수)',
      '중': '중급 (보통)',
      '하': '하급 (일반)'
    };
    
    return gradeMap[data.grade] || data.grade;
  };

  // 실제 가격 조회 함수
  const generatePrice = async (): Promise<number> => {
    try {
      // 가격 조회에 필요한 모든 데이터가 있는지 확인
      if (!data.garakCode || !data.harvestDate || !data.grade) {
        throw new Error('가격 조회에 필요한 정보가 부족합니다.');
      }

      // 동적 import로 서비스 로드 (순환 의존성 방지)
      const { PriceDataService } = await import('../../../api/priceDataService');
      
      const priceData = await PriceDataService.lookupPrice({
        garakCode: data.garakCode,
        targetDate: data.harvestDate.toISOString().split('T')[0], // YYYY-MM-DD 형식
        grade: data.grade as '특' | '상' | '중' | '하'
      });
      
      return priceData.recommendedPrice;
      
    } catch (error) {
      console.error('가격 조회 실패:', error);
      // 에러를 다시 던져서 상위에서 처리하도록 함
      throw new Error('가락시장 가격 조회에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 가격 확인 버튼 클릭 핸들러
  const handlePriceCheck = async () => {
    try {
      const price = await generatePrice();
      onPriceGenerated(price);
    } catch (error) {
      console.error('가격 생성 실패:', error);
      // 사용자에게 에러 메시지 표시 (실제 프로젝트에서는 토스트나 알림으로 처리)
      alert('가격 조회에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 폼 유효성 검사 (API 호출 제거)
  useEffect(() => {
    const isValid = Boolean(
      data.productName.trim() &&
      data.harvestDate &&
      data.grade
    );
    
    onValidationChange(isValid);
  }, [data.productName, data.harvestDate, data.grade, onValidationChange]);

  return (
    <Container>
      <Title>당신의 작물 정보를{'\n'}입력해주세요.</Title>
      
      <FormContainer>
        {/* 품목 입력 (작물명 + 품종 통합) */}
        <ProductInput
          value={data.productName}
          onChange={handleProductChange}
        />

        <GradeContainer>
          <Label>등급 (미선택 시 '중'으로 설정됩니다.)</Label>
          <GradeInput hasValue={Boolean(data.grade)} onClick={() => setIsGradeSelectorOpen(true)}>
            <span>{getGradeDisplayText()}</span>
            <GradeIcon src={iconGrade} alt="등급" />
          </GradeInput>
        </GradeContainer>

        <DateContainer>
          <Label>출하 예정일</Label>
          <DateInputContainer>
            <DateInput 
              hasValue={Boolean(data.harvestDate)}
              onClick={() => setIsDatePickerOpen(true)}
            >
              <span>
                {data.harvestDate ? formatDate(data.harvestDate) : '출하예정일을 선택해주세요'}
              </span>
              <CalendarIcon src={iconCalendar} alt="달력" />
            </DateInput>
          </DateInputContainer>
        </DateContainer>


      </FormContainer>

      {isGradeSelectorOpen && (
        <GradeSelector
          selectedGrade={data.grade}
          onGradeSelect={handleGradeSelect}
          onClose={() => setIsGradeSelectorOpen(false)}
        />
      )}

      {isDatePickerOpen && (
        <DatePicker
          selectedDate={data.harvestDate}
          onDateSelect={handleDateSelect}
          onClose={() => setIsDatePickerOpen(false)}
        />
      )}
    </Container>
  );
};

export default PriceQuoteStep; 