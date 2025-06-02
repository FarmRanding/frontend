import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import InputField from '../../common/InputField/InputField';
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
  max-width: 320px;
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

const GradeInput = styled.div`
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
  color: #9C9C9C;
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

interface PriceQuoteData {
  cropName: string;
  variety: string;
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

  const handleInputChange = (field: keyof PriceQuoteData, value: string) => {
    onChange({ [field]: value });
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

  // 가격 생성 로직 (예시)
  const generatePrice = () => {
    const basePrice = 10000;
    // 등급이 없으면 '중'으로 기본 설정
    const grade = data.grade || '중';
    const gradeMultiplier = {
      '특': 1.5,
      '상': 1.2,
      '중': 1.0,
      '하': 0.8
    }[grade] || 1.0;
    
    // 수확일에 따른 가격 변동 (예시)
    const seasonMultiplier = Math.random() * 0.3 + 0.85; // 0.85 ~ 1.15
    
    return Math.round(basePrice * gradeMultiplier * seasonMultiplier);
  };

  // 폼 유효성 검사
  useEffect(() => {
    const isValid = Boolean(
      data.cropName.trim() &&
      data.variety.trim() &&
      data.harvestDate
    );
    
    onValidationChange(isValid);
    
    // 모든 필드가 채워지면 가격 생성
    if (isValid) {
      const price = generatePrice();
      onPriceGenerated(price);
    }
  }, [data, onValidationChange, onPriceGenerated]);

  return (
    <Container>
      <Title>당신의 작물 정보를{'\n'}입력해주세요.</Title>
      
      <FormContainer>
        <InputField
          label="작물명"
          placeholder="작물명을 입력해주세요"
          value={data.cropName}
          onChange={(value) => handleInputChange('cropName', value)}
          variant="default"
        />

        <InputField
          label="품종"
          placeholder="품종을 입력해주세요"
          value={data.variety}
          onChange={(value) => handleInputChange('variety', value)}
          variant="default"
        />

        <GradeContainer>
          <Label>등급 (미선택 시 '중'으로 설정됩니다.)</Label>
          <GradeInput onClick={() => setIsGradeSelectorOpen(true)}>
            <span>{getGradeDisplayText()}</span>
            <GradeIcon src={iconGrade} alt="등급" />
          </GradeInput>
        </GradeContainer>

        <DateContainer>
          <Label>수확예정일</Label>
          <DateInputContainer>
            <DateInput 
              hasValue={Boolean(data.harvestDate)}
              onClick={() => setIsDatePickerOpen(true)}
            >
              <span>
                {data.harvestDate ? formatDate(data.harvestDate) : '수확예정일을 선택해주세요'}
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