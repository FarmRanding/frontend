import React from 'react';
import styled from 'styled-components';

// 스타일 컴포넌트들
const Container = styled.div`
  width: 100%;
`;

const Label = styled.label`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #000000;
  margin-bottom: 4px;
  display: block;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.43;
  color: #374151;
  margin-bottom: 8px;
`;

const GradeContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const GradeButton = styled.button<{ $isSelected: boolean }>`
  flex: 1;
  height: 33px;
  background: ${props => props.$isSelected ? '#8B5CF6' : '#FFFFFF'};
  border: none;
  border-radius: 8px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: ${props => props.$isSelected ? '#FFFFFF' : '#000000'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:hover {
    background: ${props => props.$isSelected ? '#7C3AED' : '#F3F4F6'};
    box-shadow: 0px 8px 24px 0px rgba(139, 92, 246, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 4px 12px 0px rgba(139, 92, 246, 0.15);
  }

  &:focus {
    outline: none;
    box-shadow: 0px 8px 24px 0px rgba(139, 92, 246, 0.2);
  }
`;

// 등급 옵션 정의
const GRADE_OPTIONS = [
  { label: '상급', value: '04', description: '최상급 품질' },
  { label: '중급', value: '05', description: '일반 품질' },
  { label: '하급', value: '06', description: '저급 품질' }
] as const;

// 타입 정의
export type GradeValue = '04' | '05' | '06';

interface GradeSelectorProps {
  value: GradeValue;
  onChange: (grade: GradeValue) => void;
  className?: string;
}

const GradeSelector: React.FC<GradeSelectorProps> = ({
  value,
  onChange,
  className
}) => {
  const handleGradeSelect = (gradeValue: GradeValue) => {
    onChange(gradeValue);
  };

  return (
    <Container className={className}>
      <Label>등급</Label>
      <GradeContainer>
        {GRADE_OPTIONS.map((grade) => (
          <GradeButton
            key={grade.value}
            type="button"
            $isSelected={value === grade.value}
            onClick={() => handleGradeSelect(grade.value)}
            title={grade.description}
          >
            {grade.label}
          </GradeButton>
        ))}
      </GradeContainer>
    </Container>
  );
};

export default GradeSelector; 