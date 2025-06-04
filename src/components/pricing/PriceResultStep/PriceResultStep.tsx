import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import iconGraph from '../../../assets/icon-graph.svg';

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

const pulsePrice = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  width: 100%;
  max-width: 320px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
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

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  animation: ${slideInUp} 0.8s ease-out 0.2s both;
`;

const PriceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const PriceIcon = styled.img`
  width: 16px;
  height: 16px;
  filter: brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1653%) hue-rotate(221deg) brightness(96%) contrast(91%);
`;

const PriceLabel = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #000000;
`;

const PriceDisplay = styled.div`
  width: 100%;
  height: 60px;
  background: #FFFFFF;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(31, 65, 187, 0.03) 0%, rgba(79, 70, 229, 0.03) 100%);
    border-radius: 8px;
  }
`;

const PriceValue = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 1.2;
  color: #1F41BB;
  position: relative;
  z-index: 1;
  animation: ${pulsePrice} 2s ease-in-out infinite;
`;

const CompleteButton = styled.button`
  width: 100%;
  max-width: 300px;
  padding: 17px;
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
  animation: ${slideInUp} 0.8s ease-out 0.6s both;

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
  cropName: string;
  variety: string;
  grade: string;
  harvestDate: Date | null;
  estimatedPrice: number;
}

interface PriceResultStepProps {
  data: PriceQuoteData;
  onComplete: () => void;
}

const PriceResultStep: React.FC<PriceResultStepProps> = ({ data, onComplete }) => {
  return (
    <Container>
      <TitleSection>
        <Title>적정 가격이{'\n'}산출되었습니다!</Title>
        
        <PriceSection>
          <PriceHeader>
            <PriceIcon src={iconGraph} alt="가격" />
            <PriceLabel>적정 가격(1kg 기준)</PriceLabel>
          </PriceHeader>
          <PriceDisplay>
            <PriceValue>{data.estimatedPrice.toLocaleString()}원</PriceValue>
          </PriceDisplay>
        </PriceSection>
      </TitleSection>

      <CompleteButton onClick={onComplete}>
        완료
      </CompleteButton>
    </Container>
  );
};

export default PriceResultStep; 