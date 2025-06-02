import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Header from '../../components/common/Header';
import InputField from '../../components/common/InputField/InputField';
import Button from '../../components/common/Button/Button';
import GradeSelector from '../../components/common/GradeSelector/GradeSelector';
import iconGrade from '../../assets/icon-grade.svg';

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

const PageContainer = styled.div`
  width: 100%;
  min-height: 874px;
  background: #F4FAFF;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 107px 16px 30px 16px; /* 56px(Header) + 51px(기존) = 107px */
  flex: 1;
  max-width: 100%;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  width: 100%;
  max-width: 320px;
  animation: ${fadeIn} 0.8s ease-out;
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

const ButtonContainer = styled.div`
  width: 100%;
  max-width: 300px;
  margin-top: 32px;
  animation: ${slideInUp} 0.8s ease-out 0.4s both;
`;

interface BrandingFormData {
  cropName: string;
  variety: string;
  cultivationMethod: string;
  grade: string;
}

const Branding: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BrandingFormData>({
    cropName: '',
    variety: '',
    cultivationMethod: '',
    grade: '',
  });
  const [showGradeSelector, setShowGradeSelector] = useState(false);

  const handleClose = () => {
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMypageClick = () => {
    navigate('/mypage');
  };

  const handleInputChange = (field: keyof BrandingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGradeSelect = (grade: string) => {
    setFormData(prev => ({
      ...prev,
      grade: grade
    }));
    setShowGradeSelector(false);
  };

  const handleNext = () => {
    console.log('다음 단계:', formData);
    navigate('/gap-verification');
  };

  const isFormValid = formData.cropName.trim() !== '' && 
                     formData.variety.trim() !== '' && 
                     formData.cultivationMethod.trim() !== '';

  const getGradeDisplayText = () => {
    if (!formData.grade) return '-';
    const gradeMap: { [key: string]: string } = {
      '특': '특급 (최고급)',
      '상': '상급 (우수)',
      '중': '중급 (보통)',
      '하': '하급 (일반)'
    };
    return gradeMap[formData.grade] || formData.grade;
  };

  return (
    <PageContainer>
      <Header 
        onClickLogo={handleLogoClick}
        onClickMypage={handleMypageClick}
      />

      <ContentArea>
        <MainContent>
          <Title>{`당신의 정성이 담긴 작물을\n멋지게 꾸며드릴게요.`}</Title>
          
          <FormContainer>
            <InputField
              label="작물명"
              placeholder="예 : 토마토"
              value={formData.cropName}
              onChange={(value) => handleInputChange('cropName', value)}
              variant="default"
            />
            
            <InputField
              label="품종"
              placeholder="예 : 스테비아 토마토"
              value={formData.variety}
              onChange={(value) => handleInputChange('variety', value)}
              variant="default"
            />
            
            <InputField
              label="재배 방식"
              placeholder="예 : 노지 재배 / 고랭지 재배"
              value={formData.cultivationMethod}
              onChange={(value) => handleInputChange('cultivationMethod', value)}
              variant="default"
            />

            <GradeContainer>
              <Label>등급 (미선택 시 '중'으로 설정됩니다.)</Label>
              <GradeInput onClick={() => setShowGradeSelector(true)}>
                <span>{getGradeDisplayText()}</span>
                <GradeIcon src={iconGrade} alt="등급" />
              </GradeInput>
            </GradeContainer>
          </FormContainer>

          <ButtonContainer>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!isFormValid}
            >
              다음
            </Button>
          </ButtonContainer>
        </MainContent>
      </ContentArea>

      {showGradeSelector && (
        <GradeSelector
          selectedGrade={formData.grade}
          onGradeSelect={handleGradeSelect}
          onClose={() => setShowGradeSelector(false)}
        />
      )}
    </PageContainer>
  );
};

export default Branding; 