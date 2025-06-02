import React from 'react';
import styled from 'styled-components';

interface TestimonialProps {
  image: string;
  name: string;
  text: string;
  reverse?: boolean;
  bgColor?: string;
  className?: string;
}

const Item = styled.div<{ reverse?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-direction: ${props => props.reverse ? 'row-reverse' : 'row'};
  width: 100%;
  max-width: 400px;
  
  /* 태블릿 */
  @media (min-width: 768px) {
    gap: 20px;
    max-width: 450px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    gap: 24px;
    max-width: 420px;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    gap: 28px;
    max-width: 480px;
  }
`;

const Img = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  
  /* 태블릿 */
  @media (min-width: 768px) {
    width: 88px;
    height: 88px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    width: 96px;
    height: 96px;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    width: 104px;
    height: 104px;
  }
`;

const Bubble = styled.div<{ bgColor: string; reverse?: boolean }>`
  position: relative;
  background: ${props => props.bgColor};
  border: 1px solid #CCCCCC;
  border-radius: 16px;
  padding: 14px 16px;
  flex: 1;
  max-width: 220px;
  color: ${props => props.bgColor === '#2748BE' ? '#fff' : '#252525'};
  font-size: 13px;
  font-family: 'Inter', sans-serif;
  line-height: 1.4;
  
  /* 태블릿 */
  @media (min-width: 768px) {
    padding: 16px 18px;
    max-width: 240px;
    font-size: 14px;
    border-radius: 18px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    padding: 18px 20px;
    max-width: 260px;
    font-size: 14px;
    border-radius: 20px;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    padding: 20px 22px;
    max-width: 280px;
    font-size: 15px;
    border-radius: 22px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 14px;
    ${props => props.reverse ? 'right: -11px' : 'left: -11px'};
    width: 12px;
    height: 20px;
    background: ${props => props.bgColor};
    border: 1px solid #CCCCCC;
    ${props => props.reverse ? 
      'border-left: none; transform: skew(15deg);' : 
      'border-right: none; transform: skew(-15deg);'
    }
    
    /* 태블릿 이상에서 말풍선 크기 조정 */
    @media (min-width: 768px) {
      top: 16px;
      width: 14px;
      height: 22px;
    }
  }
`;

const Name = styled.div`
  margin-top: 6px;
  font-size: 11px;
  color: #888;
  font-family: 'Inter', sans-serif;
  
  /* 태블릿 */
  @media (min-width: 768px) {
    margin-top: 8px;
    font-size: 12px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    font-size: 12px;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    font-size: 13px;
  }
`;

const Testimonial: React.FC<TestimonialProps> = ({
  image, name, text, reverse = false, bgColor = '#fff', className
}) => (
  <Item reverse={reverse} className={className}>
    <Img src={image} alt={name} />
    <Bubble bgColor={bgColor} reverse={reverse}>
      {text}
      <Name>{name}</Name>
    </Bubble>
  </Item>
);

export default Testimonial; 