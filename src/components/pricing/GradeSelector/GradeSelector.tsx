import React from 'react';
import styled from 'styled-components';

// 스타일 컴포넌트들
const Container = styled.div`
  width: 100%;
`;

const Label = styled.label`
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
  height: 48px;
  background: ${props => props.$isSelected ? '#8B5CF6' : '#FFFFFF'};
  border: 1px solid ${props => props.$isSelected ? '#8B5CF6' : '#E5E7EB'};
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: ${props => props.$isSelected ? '#FFFFFF' : '#374151'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:hover {
    border-color: #8B5CF6;
    background: ${props => props.$isSelected ? '#7C3AED' : '#F9FAFB'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(139, 92, 246, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
`;

// 등급 옵션 정의
const GRADE_OPTIONS = [
  { label: '상', value: '04', description: '최상급 품질' },
  { label: '중', value: '05', description: '일반 품질' },
  { label: '하', value: '06', description: '저급 품질' }
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
import styled from 'styled-components';

// 스타일 컴포넌트들
const Container = styled.div`
  width: 100%;
`;

const Label = styled.label`
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
  height: 48px;
  background: ${props => props.$isSelected ? '#8B5CF6' : '#FFFFFF'};
  border: 1px solid ${props => props.$isSelected ? '#8B5CF6' : '#E5E7EB'};
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: ${props => props.$isSelected ? '#FFFFFF' : '#374151'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:hover {
    border-color: #8B5CF6;
    background: ${props => props.$isSelected ? '#7C3AED' : '#F9FAFB'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(139, 92, 246, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
`;

// 등급 옵션 정의
const GRADE_OPTIONS = [
  { label: '상', value: '04', description: '최상급 품질' },
  { label: '중', value: '05', description: '일반 품질' },
  { label: '하', value: '06', description: '저급 품질' }
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