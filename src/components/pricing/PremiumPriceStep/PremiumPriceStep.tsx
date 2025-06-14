import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import KamisProductInput from '../KamisProductInput/KamisProductInput';
import GradeSelector, { GradeValue } from '../GradeSelector/GradeSelector';
import LocationSelector from '../../common/LocationSelector/LocationSelector';
import DatePicker from '../../common/DatePicker/DatePicker';
import iconLocation from '../../../assets/icon-location.png';
import iconCalendar from '../../../assets/icon-calendar.svg';

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

const LocationContainer = styled.div`
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

const LocationInput = styled.div<{ hasValue: boolean }>`
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
    box-shadow: 0px 8px 24px 0px rgba(139, 92, 246, 0.2);
    transform: translateY(-1px);
  }
`;

const LocationIcon = styled.img`
  width: 20px;
  height: 20px;
  opacity: 0.7;
  transition: all 0.3s ease;

  ${LocationInput}:hover & {
    opacity: 1;
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
    box-shadow: 0px 8px 24px 0px rgba(139, 92, 246, 0.2);
    transform: translateY(-1px);
  }
`;

const CalendarIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(7500%) hue-rotate(75deg) brightness(98%) contrast(100%);
  transition: all 0.3s ease;

  ${DateInput}:hover & {
    filter: brightness(0) saturate(100%) invert(55%) sepia(98%) saturate(1653%) hue-rotate(248deg) brightness(96%) contrast(91%);
    transform: scale(1.1);
  }
`;

const PriceCheckButton = styled.button`
  width: 100%;
  max-width: 300px;
  padding: 15px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
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
    background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  }
`;

// KAMIS 상품 타입
interface KamisProduct {
  itemCode: string;
  itemName: string;
  kindCode: string;
  kindName: string;
}

// 프리미엄 가격 제안 데이터 타입
interface PremiumPriceData {
  productItemCode: string;
  productVarietyCode: string;
  productName: string;
  productRankCode: GradeValue;
  location: string;
  date: Date | null;
}

interface PremiumPriceStepProps {
  data: PremiumPriceData;
  onChange: (data: Partial<PremiumPriceData>) => void;
  onValidationChange: (isValid: boolean) => void;
  onPriceGenerated: (priceData: any) => void;
}

const PremiumPriceStep: React.FC<PremiumPriceStepProps> = ({
  data,
  onChange,
  onValidationChange,
  onPriceGenerated
}) => {
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleProductChange = (product: KamisProduct) => {
    // KAMIS 상품 데이터를 프리미엄 가격 제안 형식으로 변환
    onChange({
      productItemCode: product.itemCode, // KAMIS 품목 코드
      productVarietyCode: product.kindCode, // KAMIS 품종 코드
      productName: product.itemName // 품목명
    });
  };

  const handleGradeChange = (grade: GradeValue) => {
    onChange({ productRankCode: grade });
  };

  const handleLocationSelect = (location: string) => {
    onChange({ location });
    setIsLocationSelectorOpen(false);
  };

  const handleDateSelect = (date: Date) => {
    onChange({ date });
    setIsDatePickerOpen(false);
  };

  const getLocationDisplayText = () => {
    if (!data.location) return '지역을 선택해주세요';
    
    // 지역 코드를 표시명으로 변환
    const locationMap: { [key: string]: string } = {
      '서울': '서울특별시',
      '부산': '부산광역시',
      '대구': '대구광역시',
      '인천': '인천광역시',
      '광주': '광주광역시',
      '대전': '대전광역시',
      '울산': '울산광역시',
      '세종': '세종특별자치시',
      '경기': '경기도',
      '강원': '강원도',
      '충북': '충청북도',
      '충남': '충청남도',
      '전북': '전라북도',
      '전남': '전라남도',
      '경북': '경상북도',
      '경남': '경상남도',
      '제주': '제주특별자치도'
    };
    
    return locationMap[data.location] || data.location;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };



  // 폼 유효성 검사
  useEffect(() => {
    const isValid = Boolean(
      data.productName.trim() &&
      data.productRankCode &&
      data.location &&
      data.date
    );
    
    onValidationChange(isValid);
  }, [data.productName, data.productRankCode, data.location, data.date, onValidationChange]);

  return (
    <Container>
      <Title>프리미엄 농산물 정보를{'\n'}입력해주세요.</Title>
      
      <FormContainer>
        {/* 품목 입력 */}
        <KamisProductInput
          value={data.productName}
          onChange={handleProductChange}
        />

        {/* 등급 선택 */}
        <GradeSelector
          value={data.productRankCode}
          onChange={handleGradeChange}
        />

        <LocationContainer>
          <Label>지역</Label>
          <LocationInput
            hasValue={!!data.location}
            onClick={() => setIsLocationSelectorOpen(true)}
          >
            <span>{getLocationDisplayText()}</span>
            <LocationIcon src={iconLocation} alt="지역" />
          </LocationInput>
        </LocationContainer>

        <DateContainer>
          <Label>출하 예정일</Label>
          <DateInputContainer>
            <DateInput
              hasValue={!!data.date}
              onClick={() => setIsDatePickerOpen(true)}
            >
              <span>
                {data.date ? formatDate(data.date) : '기준날짜를 선택해주세요'}
              </span>
              <CalendarIcon src={iconCalendar} alt="달력" />
            </DateInput>
          </DateInputContainer>
        </DateContainer>
      </FormContainer>

      <LocationSelector
        isOpen={isLocationSelectorOpen}
        onClose={() => setIsLocationSelectorOpen(false)}
        onSelect={handleLocationSelect}
        selectedLocation={data.location}
      />

      {isDatePickerOpen && (
        <DatePicker
          selectedDate={data.date}
          onDateSelect={handleDateSelect}
          onClose={() => setIsDatePickerOpen(false)}
        />
      )}
    </Container>
  );
};

export default PremiumPriceStep; 
import styled, { keyframes } from 'styled-components';
import KamisProductInput from '../KamisProductInput/KamisProductInput';
import GradeSelector, { GradeValue } from '../GradeSelector/GradeSelector';
import LocationSelector from '../../common/LocationSelector/LocationSelector';
import DatePicker from '../../common/DatePicker/DatePicker';
import iconLocation from '../../../assets/icon-location.png';
import iconCalendar from '../../../assets/icon-calendar.svg';

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

const LocationContainer = styled.div`
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

const LocationInput = styled.div<{ hasValue: boolean }>`
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
    box-shadow: 0px 8px 24px 0px rgba(139, 92, 246, 0.2);
    transform: translateY(-1px);
  }
`;

const LocationIcon = styled.img`
  width: 20px;
  height: 20px;
  opacity: 0.7;
  transition: all 0.3s ease;

  ${LocationInput}:hover & {
    opacity: 1;
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
    box-shadow: 0px 8px 24px 0px rgba(139, 92, 246, 0.2);
    transform: translateY(-1px);
  }
`;

const CalendarIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(7500%) hue-rotate(75deg) brightness(98%) contrast(100%);
  transition: all 0.3s ease;

  ${DateInput}:hover & {
    filter: brightness(0) saturate(100%) invert(55%) sepia(98%) saturate(1653%) hue-rotate(248deg) brightness(96%) contrast(91%);
    transform: scale(1.1);
  }
`;

const PriceCheckButton = styled.button`
  width: 100%;
  max-width: 300px;
  padding: 15px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
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
    background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  }
`;

// KAMIS 상품 타입
interface KamisProduct {
  itemCode: string;
  itemName: string;
  kindCode: string;
  kindName: string;
}

// 프리미엄 가격 제안 데이터 타입
interface PremiumPriceData {
  productItemCode: string;
  productVarietyCode: string;
  productName: string;
  productRankCode: GradeValue;
  location: string;
  date: Date | null;
}

interface PremiumPriceStepProps {
  data: PremiumPriceData;
  onChange: (data: Partial<PremiumPriceData>) => void;
  onValidationChange: (isValid: boolean) => void;
  onPriceGenerated: (priceData: any) => void;
}

const PremiumPriceStep: React.FC<PremiumPriceStepProps> = ({
  data,
  onChange,
  onValidationChange,
  onPriceGenerated
}) => {
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleProductChange = (product: KamisProduct) => {
    // KAMIS 상품 데이터를 프리미엄 가격 제안 형식으로 변환
    onChange({
      productItemCode: product.itemCode, // KAMIS 품목 코드
      productVarietyCode: product.kindCode, // KAMIS 품종 코드
      productName: product.itemName // 품목명
    });
  };

  const handleGradeChange = (grade: GradeValue) => {
    onChange({ productRankCode: grade });
  };

  const handleLocationSelect = (location: string) => {
    onChange({ location });
    setIsLocationSelectorOpen(false);
  };

  const handleDateSelect = (date: Date) => {
    onChange({ date });
    setIsDatePickerOpen(false);
  };

  const getLocationDisplayText = () => {
    if (!data.location) return '지역을 선택해주세요';
    
    // 지역 코드를 표시명으로 변환
    const locationMap: { [key: string]: string } = {
      '서울': '서울특별시',
      '부산': '부산광역시',
      '대구': '대구광역시',
      '인천': '인천광역시',
      '광주': '광주광역시',
      '대전': '대전광역시',
      '울산': '울산광역시',
      '세종': '세종특별자치시',
      '경기': '경기도',
      '강원': '강원도',
      '충북': '충청북도',
      '충남': '충청남도',
      '전북': '전라북도',
      '전남': '전라남도',
      '경북': '경상북도',
      '경남': '경상남도',
      '제주': '제주특별자치도'
    };
    
    return locationMap[data.location] || data.location;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };



  // 폼 유효성 검사
  useEffect(() => {
    const isValid = Boolean(
      data.productName.trim() &&
      data.productRankCode &&
      data.location &&
      data.date
    );
    
    onValidationChange(isValid);
  }, [data.productName, data.productRankCode, data.location, data.date, onValidationChange]);

  return (
    <Container>
      <Title>프리미엄 농산물 정보를{'\n'}입력해주세요.</Title>
      
      <FormContainer>
        {/* 품목 입력 */}
        <KamisProductInput
          value={data.productName}
          onChange={handleProductChange}
        />

        {/* 등급 선택 */}
        <GradeSelector
          value={data.productRankCode}
          onChange={handleGradeChange}
        />

        <LocationContainer>
          <Label>지역</Label>
          <LocationInput
            hasValue={!!data.location}
            onClick={() => setIsLocationSelectorOpen(true)}
          >
            <span>{getLocationDisplayText()}</span>
            <LocationIcon src={iconLocation} alt="지역" />
          </LocationInput>
        </LocationContainer>

        <DateContainer>
          <Label>출하 예정일</Label>
          <DateInputContainer>
            <DateInput
              hasValue={!!data.date}
              onClick={() => setIsDatePickerOpen(true)}
            >
              <span>
                {data.date ? formatDate(data.date) : '기준날짜를 선택해주세요'}
              </span>
              <CalendarIcon src={iconCalendar} alt="달력" />
            </DateInput>
          </DateInputContainer>
        </DateContainer>
      </FormContainer>

      <LocationSelector
        isOpen={isLocationSelectorOpen}
        onClose={() => setIsLocationSelectorOpen(false)}
        onSelect={handleLocationSelect}
        selectedLocation={data.location}
      />

      {isDatePickerOpen && (
        <DatePicker
          selectedDate={data.date}
          onDateSelect={handleDateSelect}
          onClose={() => setIsDatePickerOpen(false)}
        />
      )}
    </Container>
  );
};

export default PremiumPriceStep; 