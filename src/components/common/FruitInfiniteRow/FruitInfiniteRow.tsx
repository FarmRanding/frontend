import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface FruitInfiniteRowProps {
  images: string[];
  direction: 'left' | 'right';
  speed?: number;
  shadow?: boolean;
  rowIndex?: number;
}

// 각 줄별로 지연시간을 두어 순차적으로 표시
const LOAD_DELAY_PER_ROW = 800;

// 이미지 프리로딩 훅
const useImageLoader = (images: string[], delay: number) => {
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const loadPromises = images.map((src) => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = src;
          });
        });

        await Promise.all(loadPromises);
        setAllLoaded(true);
      } catch (error) {
        setAllLoaded(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [images, delay]);

  return { allLoaded };
};

// 기존 잘 작동하던 애니메이션들 - 각 줄별로 독립적
const scrollAnimation1 = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-97.5%);
  }
`;

const scrollAnimation2 = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-97.5%);
  }
`;

const scrollAnimation3 = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-99.5%);
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const RowWrapper = styled.div<{ $show: boolean }>`
  width: 100%;
  height: 80px;
  overflow: hidden;
  position: relative;
  opacity: ${props => props.$show ? 1 : 0};
  animation: ${props => props.$show ? fadeIn : 'none'} 0.6s ease-out;
  
  @media (min-width: 768px) {
    height: 100px;
  }
`;

const AnimationTrack = styled.div<{ 
  $direction: 'left' | 'right'; 
  $speed: number;
  $rowIndex: number;
}>`
  display: flex;
  gap: 20px;
  animation: ${props => {
    const animationMap = [scrollAnimation1, scrollAnimation2, scrollAnimation3];
    return animationMap[props.$rowIndex] || scrollAnimation1;
  }} ${props => props.$speed}s linear infinite;
  animation-direction: ${props => props.$direction === 'right' ? 'reverse' : 'normal'};
  will-change: transform;
  
  @media (min-width: 768px) {
    gap: 24px;
  }
`;

const FruitImage = styled.img<{ $shadow: boolean }>`
  height: 70px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
  
  ${props => props.$shadow && `
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.15));
  `}
  
  @media (min-width: 768px) {
    height: 90px;
  }
`;

const FruitInfiniteRow: React.FC<FruitInfiniteRowProps> = ({
  images,
  direction,
  speed = 20,
  shadow = true,
  rowIndex = 0
}) => {
  const delayTime = rowIndex * LOAD_DELAY_PER_ROW;
  const { allLoaded } = useImageLoader(images, delayTime);
  
  // 충분히 많이 복제하여 끊김 없는 애니메이션 (8번 복제)
  const extendedImages = [
    ...images, ...images, ...images, ...images,
    ...images, ...images, ...images, ...images
  ];

  if (!allLoaded) {
    return null;
  }

  return (
    <RowWrapper $show={allLoaded}>
      <AnimationTrack $direction={direction} $speed={speed} $rowIndex={rowIndex}>
        {extendedImages.map((imageSrc, index) => (
          <FruitImage
            key={`${imageSrc}-${index}`}
            src={imageSrc}
            alt={`과일 ${index}`}
            $shadow={shadow}
            loading="eager"
            draggable={false}
          />
        ))}
      </AnimationTrack>
    </RowWrapper>
  );
};

export default FruitInfiniteRow;