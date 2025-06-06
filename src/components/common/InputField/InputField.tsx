import React from 'react';
import styled from 'styled-components';
import iconCopy from '../../../assets/icon-copy.svg';
import iconCalendar from '../../../assets/icon-calendar.svg';
import iconGrade from '../../../assets/icon-grade.svg';

const INPUT_FIELD_WIDTH = 320;
const INPUT_FIELD_HEIGHT_NORMAL = 33;
const INPUT_FIELD_HEIGHT_LARGE = 320;

const Container = styled.div<{ width?: number }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: ${props => props.width || INPUT_FIELD_WIDTH}px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: auto;
`;

const Label = styled.label`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #000000;
  margin: 0;
`;

const CopyIconButton = styled.button`
  width: 16px;
  height: 16px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.5;
  }

  &:focus {
    outline: 2px solid #1f41bb;
    outline-offset: 2px;
  }
`;

const CopyIcon = styled.img`
  width: 16px;
  height: 16px;
  display: block;
`;

const InputContainer = styled.div<{ height?: number }>`
  position: relative;
  width: 100%;
  height: ${props => props.height || INPUT_FIELD_HEIGHT_NORMAL}px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
`;

const InputField = styled.input<{ hasIcon?: boolean; height?: number }>`
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: ${props => props.hasIcon ? '0 40px 0 7px' : '0 7px'};
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.21;
  color: #000000;
  box-sizing: border-box;

  &::placeholder {
    color: #9c9c9c;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea<{ hasIcon?: boolean }>`
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: ${props => props.hasIcon ? '7px 40px 7px 7px' : '7px'};
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.21;
  color: #000000;
  box-sizing: border-box;
  resize: none;

  &::placeholder {
    color: #9c9c9c;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CalendarIconContainer = styled.div`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 27.234px;
  height: 27.234px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CalendarIcon = styled.img`
  width: 22.695px;
  height: 22.695px;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

const GradeIconContainer = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GradeIcon = styled.img`
  width: 27px;
  height: 27px;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

export type InputFieldVariant = 'default' | 'withCopy' | 'large' | 'calendar' | 'grade';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onCopy?: () => void;
  onCalendarClick?: () => void;
  onGradeClick?: () => void;
  variant?: InputFieldVariant;
  className?: string;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

const InputFieldComponent: React.FC<InputFieldProps> = ({
  label,
  placeholder = '예 : 토마토',
  value = '',
  onChange,
  onCopy,
  onCalendarClick,
  onGradeClick,
  variant = 'default',
  className,
  disabled = false,
  inputRef,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
  };

  const handleCopyClick = () => {
    onCopy?.();
  };

  const handleCalendarClick = () => {
    onCalendarClick?.();
  };

  const handleGradeClick = () => {
    onGradeClick?.();
  };

  const handleInputClick = () => {
    if (hasGrade && onGradeClick) {
      onGradeClick();
    }
  };

  const isLarge = variant === 'large';
  const hasCalendar = variant === 'calendar';
  const hasGrade = variant === 'grade';
  const hasCopy = variant === 'withCopy' || variant === 'large';
  const inputHeight = isLarge ? INPUT_FIELD_HEIGHT_LARGE : INPUT_FIELD_HEIGHT_NORMAL;
  const calendarPlaceholder = hasCalendar ? ' 년 / 월 / 일' : placeholder;
  const gradePlaceholder = hasGrade ? '-' : placeholder;

  return (
    <Container className={className}>
      <LabelContainer>
        <Label>{label}</Label>
        {hasCopy && (
          <CopyIconButton 
            onClick={handleCopyClick} 
            aria-label="복사"
            type="button"
            disabled={disabled}
          >
            <CopyIcon src={iconCopy} alt="복사" />
          </CopyIconButton>
        )}
      </LabelContainer>
      <InputContainer height={inputHeight}>
        {isLarge ? (
          <TextArea
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            aria-label={label}
          />
        ) : (
          <InputField
            ref={inputRef}
            type="text"
            placeholder={hasGrade ? gradePlaceholder : calendarPlaceholder}
            value={value}
            onChange={handleInputChange}
            onClick={handleInputClick}
            hasIcon={hasCalendar || hasGrade}
            disabled={disabled}
            readOnly={hasGrade}
            aria-label={label}
            style={{ cursor: hasGrade ? 'pointer' : 'text' }}
          />
        )}
        {hasCalendar && (
          <CalendarIconContainer>
            <CalendarIcon 
              src={iconCalendar} 
              alt="달력" 
              onClick={onCalendarClick ? handleCalendarClick : undefined}
            />
          </CalendarIconContainer>
        )}
        {hasGrade && (
          <GradeIconContainer>
            <GradeIcon 
              src={iconGrade} 
              alt="등급" 
              onClick={onGradeClick ? handleGradeClick : undefined}
            />
          </GradeIconContainer>
        )}
      </InputContainer>
    </Container>
  );
};

export default InputFieldComponent; 