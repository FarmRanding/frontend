import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import miniLogo from '../../assets/miniLogo.svg';
import card1 from '../../assets/card1.svg';
import card2 from '../../assets/card2.svg';
import background from '../../assets/background.svg';
import iconPeople1 from '../../assets/icon-people1.svg';
import iconPeople2 from '../../assets/icon-people2.svg';
import iconPeople3 from '../../assets/icon-people3.svg';
import FruitInfiniteRow from '../../components/common/FruitInfiniteRow';
import Testimonial from '../../components/common/Testimonial';
import SignupModal from '../../components/common/SignupModal';
import logo from '../../assets/logo.svg';
import chevronUp from '../../assets/icon-ChevronUp.svg';
import kakaoLogin from '../../assets/kakaoLogin.svg';

// 과일 이미지 import - 최적화된 버전 사용 + 우선순위별로 정렬
import fruit1 from '../../assets/fruit-optimized/image 13.svg'; // 183KB
import fruit2 from '../../assets/fruit-optimized/image 30.svg'; // 184KB  
import fruit3 from '../../assets/fruit-optimized/image 17.svg'; // 260KB
import fruit4 from '../../assets/fruit-optimized/Garlic.svg'; // 490KB

// 빠른 로딩용 기본 이미지들 (4개씩 3줄 = 12개)
const fastLoadingFruits = [fruit1, fruit2, fruit3, fruit4];

// 나머지 이미지들 (점진적 로딩용)
import fruit5 from '../../assets/fruit-optimized/Chili Pepper.svg'; // 517KB
import fruit6 from '../../assets/fruit-optimized/Avocado from Recraft.svg'; // 539KB
import fruit7 from '../../assets/fruit-optimized/Watermelon.svg'; // 558KB
import fruit8 from '../../assets/fruit-optimized/Grape.svg'; // 564KB

const mediumLoadingFruits = [fruit5, fruit6, fruit7, fruit8];

// 큰 이미지들 (마지막 로딩)
import fruit9 from '../../assets/fruit-optimized/Potato from Recraft.svg'; // 734KB
import fruit10 from '../../assets/fruit-optimized/Pumpkin from Recraft.svg'; // 785KB
import fruit11 from '../../assets/fruit-optimized/Lemon.svg'; // 806KB
import fruit12 from '../../assets/fruit-optimized/Asparagus from Recraft.svg'; // 844KB

const slowLoadingFruits = [fruit9, fruit10, fruit11, fruit12];

// 모든 과일 (점진적 확장)
const allFruits = [...fastLoadingFruits, ...mediumLoadingFruits, ...slowLoadingFruits];

const fruitImages = [
  fruit1, fruit2, fruit3, fruit4, fruit5, fruit6, fruit7, fruit8, fruit9, fruit10, fruit11, fruit12
];

// 랜딩페이지 전체 래퍼 - 완전히 흰색 배경
const LandingPageWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 50%, #FFFFFF 100%);
  position: relative;
  overflow-x: hidden;
  
  /* 배경 그라데이션 오브들 - 전체 페이지에 적용 */
  &::before {
    content: '';
    position: fixed;
    top: 10%;
    left: -5%;
    width: 50%;
    height: 60%;
    background: radial-gradient(circle, rgba(31, 65, 187, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    animation: float1 20s ease-in-out infinite;
    z-index: 0;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: fixed;
    bottom: 10%;
    right: -5%;
    width: 60%;
    height: 70%;
    background: radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    animation: float2 25s ease-in-out infinite reverse;
    z-index: 0;
    pointer-events: none;
  }
  
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(20px, -20px) scale(1.05); }
    50% { transform: translate(-10px, 10px) scale(0.95); }
    75% { transform: translate(-20px, -10px) scale(1.02); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(-25px, 20px) scale(1.03); }
    66% { transform: translate(15px, -15px) scale(0.97); }
  }
`;

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: transparent;
  position: relative;
  padding: 56px 16px 0 16px;
  box-sizing: border-box;
  
  /* 모바일 퍼스트 */
  @media (min-width: 768px) {
    padding: 56px 32px 0 32px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    padding: 56px 40px 0 40px;
  }
`;

const LandingHeader = styled.header`
  width: 100vw;
  height: 56px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  transition: all 0.3s ease;
`;

const HeaderContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  
  /* 태블릿 */
  @media (min-width: 768px) {
    padding: 0 32px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    padding: 0 40px;
  }
`;

const LogoButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const NavMenu = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: rgba(31, 65, 187, 0.08);
    color: #1F41BB;
    transform: translateY(-1px);
  }
`;

const HeroSection = styled.section`
  width: 100%;
  min-height: 500px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0 40px 0;
  margin-bottom: 0px;
  overflow: hidden;
  
  /* 태블릿 */
  @media (min-width: 768px) {
    min-height: 600px;
    padding: 100px 0 60px 0;
    margin-bottom: 0px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    min-height: 700px;
    padding: 120px 0 80px 0;
    margin-bottom: 0px;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    min-height: 800px;
    padding: 140px 0 100px 0;
    margin-bottom: 0px;
  }
`;

const BgLogo = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 220px;
  height: 320px;
  opacity: 0.03;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
  
  /* 태블릿 */
  @media (min-width: 768px) {
    width: 280px;
    height: 408px;
    opacity: 0.04;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    width: 340px;
    height: 496px;
    opacity: 0.05;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    width: 400px;
    height: 584px;
    opacity: 0.06;
  }
`;

const MainTitle = styled.h1`
  font-family: 'Jalnan 2', sans-serif !important;
  font-size: 40px;
  background: linear-gradient(135deg, #1F41BB 0%, #4F46E5 50%, #7C3AED 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin: 0 0 24px 0;
  z-index: 2;
  letter-spacing: -0.02em;
  position: relative;
  
  /* 태블릿 */
  @media (min-width: 768px) {
    font-size: 52px;
    margin: 0 0 28px 0;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    font-size: 64px;
    margin: 0 0 32px 0;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    font-size: 72px;
    margin: 0 0 36px 0;
  }
`;

const SubTitle = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 18px;
  color: #4A5568;
  text-align: center;
  z-index: 2;
  line-height: 1.6;
  margin-bottom: 48px;
  font-weight: 400;
  max-width: 600px;
  position: relative;
  
  /* 태블릿 */
  @media (min-width: 768px) {
    font-size: 20px;
    line-height: 1.7;
    margin-bottom: 56px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    font-size: 22px;
    line-height: 1.7;
    margin-bottom: 64px;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    font-size: 24px;
    line-height: 1.8;
    margin-bottom: 72px;
  }
`;

const HighlightText = styled.span`
  background: linear-gradient(135deg, #1F41BB 0%, #4F46E5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 1.1em;
  
  /* 태블릿 */
  @media (min-width: 768px) {
    font-size: 1.15em;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    font-size: 1.2em;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    font-size: 1.25em;
  }
`;

const BrandText = styled.span`
  background: linear-gradient(135deg, #1F41BB 0%, #4F46E5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  font-size: 1.2em;
  
  /* 태블릿 */
  @media (min-width: 768px) {
    font-size: 1.25em;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    font-size: 1.3em;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    font-size: 1.35em;
  }
`;

const FruitSection = styled.section`
  width: 100vw;
  background: transparent;
  padding: 20px 0 80px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  margin-left: -16px;
  margin-right: -16px;
  min-height: 270px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(31, 65, 187, 0.1) 50%, transparent 100%);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 40px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(31, 65, 187, 0.1) 50%, transparent 100%);
  }
  
  /* 태블릿에서도 전체 너비 */
  @media (min-width: 768px) {
    margin-left: -32px;
    margin-right: -32px;
    min-height: 330px;
    padding: 40px 0 100px 0;
    gap: 20px;
  }
  
  /* 데스크탑에서도 전체 너비 */
  @media (min-width: 1024px) {
    margin-left: -40px;
    margin-right: -40px;
    min-height: 330px;
    padding: 60px 0 120px 0;
    gap: 24px;
  }
`;

const SectionHeader = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 60px;
  
  @media (min-width: 768px) {
    margin-bottom: 80px;
  }
  
  @media (min-width: 1024px) {
    margin-bottom: 100px;
  }
`;

const SectionMainTitle = styled.h2`
  font-family: 'Jalnan 2', sans-serif !important;
  font-size: 32px;
  background: linear-gradient(135deg, #1F41BB 0%, #4F46E5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px 0;
  letter-spacing: -0.01em;
  
  @media (min-width: 768px) {
    font-size: 36px;
    margin: 0 0 20px 0;
  }
  
  @media (min-width: 1024px) {
    font-size: 40px;
    margin: 0 0 24px 0;
  }
`;

const SectionSubTitle = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  color: #6B7280;
  line-height: 1.6;
  margin: 0;
  max-width: 500px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    font-size: 18px;
    max-width: 600px;
  }
  
  @media (min-width: 1024px) {
    font-size: 20px;
    max-width: 700px;
  }
`;

const SectionDivider = styled.div`
  width: 100%;
  height: 120px;
  background: linear-gradient(180deg, transparent 0%, rgba(31, 65, 187, 0.02) 50%, transparent 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
  
  &::before {
    content: '';
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #1F41BB 50%, transparent 100%);
    border-radius: 1px;
  }
  
  @media (min-width: 768px) {
    height: 140px;
    margin: 60px 0;
    
    &::before {
      width: 80px;
    }
  }
  
  @media (min-width: 1024px) {
    height: 160px;
    margin: 80px 0;
    
    &::before {
      width: 100px;
    }
  }
`;

const ServiceSection = styled.section`
  width: 100%;
  padding: 60px 0;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  position: relative;
  
  /* 태블릿 */
  @media (min-width: 768px) {
    padding: 80px 0;
    gap: 56px;
  }
  
  /* 데스크탑 - 가로 배치 */
  @media (min-width: 1024px) {
    padding: 100px 0;
    flex-direction: row;
    justify-content: center;
    gap: 64px;
    align-items: flex-start;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    padding: 120px 0;
    gap: 80px;
  }
`;

const ServiceBlock = styled.div`
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  
  /* 태블릿 */
  @media (min-width: 768px) {
    max-width: 520px;
    gap: 36px;
  }
  
  /* 데스크탑 - 가로 배치용 */
  @media (min-width: 1024px) {
    width: 45%;
    max-width: 560px;
    gap: 40px;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    width: 42%;
    max-width: 600px;
    gap: 44px;
  }
`;

const ServiceCardTitle = styled.h2`
  font-family: 'Jalnan 2', sans-serif !important;
  font-size: 20px;
  color: #1F41BB;
  margin: 0;
  text-align: center;
  line-height: 1.4;
  width: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 255, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 8px 32px rgba(31, 65, 187, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  box-sizing: border-box;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 48px rgba(31, 65, 187, 0.12);
  }
  
  /* 태블릿 */
  @media (min-width: 768px) {
    font-size: 22px;
    line-height: 1.4;
    padding: 36px 32px;
    border-radius: 28px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    font-size: 24px;
    line-height: 1.3;
    padding: 40px 36px;
    border-radius: 32px;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    font-size: 26px;
    line-height: 1.3;
    padding: 44px 40px;
    border-radius: 36px;
  }
`;

// Inter 폰트를 위한 강제 스타일 컴포넌트
const ServiceCardMainTitle = styled.span`
  font-size: 1.2em;
  color: #1F41BB;
  font-weight: 700;
  font-family: 'Jalnan 2', sans-serif !important;
  display: block;
  margin-bottom: 8px;
`;

const ServiceDescription = styled.span`
  color: #6B7280 !important;
  font-size: 0.85em !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
  font-weight: 500 !important;
  line-height: 1.5 !important;
  opacity: 0.9;
`;

const ServiceCardImg = styled.img`
  width: 100%;
  max-width: 480px;
  height: auto;
  display: block;
  margin: 0 auto;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(31, 65, 187, 0.12);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
  
  /* 태블릿 */
  @media (min-width: 768px) {
    max-width: 520px;
    border-radius: 28px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    max-width: 560px;
    border-radius: 32px;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 60px rgba(31, 65, 187, 0.16);
    }
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    max-width: 600px;
    border-radius: 36px;
  }
`;

const TestimonialSection = styled.section`
  width: 100%;
  padding: 80px 0 100px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  position: relative;
  min-height: 400px;
  background: linear-gradient(180deg, transparent 0%, rgba(31, 65, 187, 0.01) 50%, transparent 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #1F41BB 50%, transparent 100%);
    border-radius: 1px;
  }
  
  /* 태블릿 */
  @media (min-width: 768px) {
    padding: 100px 0 120px 0;
    gap: 56px;
    min-height: 500px;
    
    &::before {
      width: 160px;
    }
  }
  
  /* 데스크탑 - 그리드 레이아웃 */
  @media (min-width: 1024px) {
    padding: 120px 0 140px 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 56px 40px;
    justify-items: center;
    align-items: start;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 400px;
    
    &::before {
      width: 200px;
      grid-column: 1 / 3;
      position: relative;
      top: -40px;
      left: 0;
      transform: none;
      margin-bottom: 20px;
    }
    
    /* 첫 번째 후기 - 왼쪽 상단 */
    & > *:nth-child(2) {
      grid-column: 1;
      grid-row: 2;
      justify-self: end;
    }
    
    /* 두 번째 후기 - 오른쪽 전체 (세로로 중앙 배치) */
    & > *:nth-child(3) {
      grid-column: 2;
      grid-row: 2 / 4;
      align-self: center;
      justify-self: start;
    }
    
    /* 세 번째 후기 - 왼쪽 하단 */
    & > *:nth-child(4) {
      grid-column: 1;
      grid-row: 3;
      justify-self: end;
    }
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    padding: 140px 0 160px 0;
    gap: 64px 48px;
    max-width: 1400px;
  }
`;

const ScrollToTopWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-top: 60px;
  padding-bottom: 80px;
  
  /* 태블릿 */
  @media (min-width: 768px) {
    margin-top: 80px;
    padding-bottom: 100px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    margin-top: 100px;
    padding-bottom: 120px;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    margin-top: 120px;
    padding-bottom: 140px;
  }
`;

const ScrollToTopButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border: none;
  background: linear-gradient(135deg, #1F41BB 0%, #4F46E5 100%);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  box-shadow: 
    0 8px 24px rgba(31, 65, 187, 0.25),
    0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: scale(1.1) translateY(-4px);
    box-shadow: 
      0 16px 40px rgba(31, 65, 187, 0.35),
      0 8px 16px rgba(0, 0, 0, 0.15);
      
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: scale(1.05) translateY(-2px);
  }
  
  /* 태블릿 */
  @media (min-width: 768px) {
    width: 72px;
    height: 72px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    width: 80px;
    height: 80px;
    
    &:hover {
      transform: scale(1.15) translateY(-6px);
      box-shadow: 
        0 20px 48px rgba(31, 65, 187, 0.4),
        0 12px 20px rgba(0, 0, 0, 0.2);
    }
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    width: 88px;
    height: 88px;
  }
`;

const ScrollToTopIcon = styled.img`
  width: 28px;
  height: 28px;
  pointer-events: none;
  transition: all 0.3s ease;
  filter: brightness(0) invert(1);
  
  /* 태블릿 */
  @media (min-width: 768px) {
    width: 32px;
    height: 32px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    width: 36px;
    height: 36px;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    width: 40px;
    height: 40px;
  }
  
  ${ScrollToTopButton}:hover & {
    transform: translateY(-2px);
  }
`;

const RelativeBgSection = styled.div`
  position: relative;
  width: 100%;
  min-height: 1200px;
  overflow: hidden;
  background: linear-gradient(180deg, 
    rgba(248, 250, 255, 0.3) 0%, 
    rgba(255, 255, 255, 0.1) 25%,
    rgba(248, 250, 255, 0.2) 75%,
    rgba(255, 255, 255, 0.1) 100%
  );

  .section-bg-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.6;
    z-index: 0;
    pointer-events: none;
    user-select: none;
    object-fit: cover;
    filter: blur(0.5px);
  }

  & > *:not(.section-bg-img) {
    position: relative;
    z-index: 1;
  }
`;

const KakaoLoginButton = styled.button`
  display: block;
  width: 280px;
  height: 56px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  padding: 0;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
      
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.01);
  }
  
  /* 태블릿 */
  @media (min-width: 768px) {
    width: 320px;
    height: 64px;
    border-radius: 18px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    width: 360px;
    height: 72px;
    border-radius: 20px;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    width: 400px;
    height: 80px;
    border-radius: 22px;
  }
`;

const KakaoLoginImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  border-radius: inherit;
`;

// CTA 섹션 스타일
const CtaSection = styled.section`
  width: 100%;
  padding: 80px 0 60px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  background: linear-gradient(135deg, rgba(31, 65, 187, 0.02) 0%, rgba(79, 70, 229, 0.01) 100%);
  border-radius: 32px 32px 0 0;
  margin-top: 60px;
  
  @media (min-width: 768px) {
    padding: 100px 0 80px 0;
    margin-top: 80px;
    border-radius: 40px 40px 0 0;
  }
  
  @media (min-width: 1024px) {
    padding: 120px 0 100px 0;
    margin-top: 100px;
    border-radius: 48px 48px 0 0;
  }
`;

const CtaTitle = styled.h2`
  font-family: 'Jalnan 2', sans-serif !important;
  font-size: 32px;
  background: linear-gradient(135deg, #1F41BB 0%, #4F46E5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px 0;
  letter-spacing: -0.01em;
  
  @media (min-width: 768px) {
    font-size: 36px;
    margin: 0 0 20px 0;
  }
  
  @media (min-width: 1024px) {
    font-size: 40px;
    margin: 0 0 24px 0;
  }
`;

const CtaSubtitle = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  color: #6B7280;
  line-height: 1.6;
  margin: 0 0 48px 0;
  max-width: 500px;
  
  @media (min-width: 768px) {
    font-size: 18px;
    margin: 0 0 56px 0;
    max-width: 600px;
  }
  
  @media (min-width: 1024px) {
    font-size: 20px;
    margin: 0 0 64px 0;
    max-width: 700px;
  }
`;

const CtaButton = styled.button`
  display: block;
  width: 320px;
  height: 64px;
  background: linear-gradient(135deg, #1F41BB 0%, #4F46E5 100%);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  padding: 0;
  overflow: hidden;
  position: relative;
  box-shadow: 
    0 8px 32px rgba(31, 65, 187, 0.25),
    0 2px 8px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 
      0 16px 48px rgba(31, 65, 187, 0.35),
      0 8px 16px rgba(0, 0, 0, 0.15);
      
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.01);
  }
  
  /* 태블릿 */
  @media (min-width: 768px) {
    width: 360px;
    height: 72px;
    border-radius: 22px;
  }
  
  /* 데스크탑 */
  @media (min-width: 1024px) {
    width: 400px;
    height: 80px;
    border-radius: 24px;
  }
  
  /* 대형 화면 */
  @media (min-width: 1440px) {
    width: 440px;
    height: 88px;
    border-radius: 26px;
  }
`;

const CtaButtonText = styled.span`
  font-family: 'Jalnan 2', sans-serif !important;
  font-size: 18px;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
  
  @media (min-width: 768px) {
    font-size: 20px;
    gap: 10px;
  }
  
  @media (min-width: 1024px) {
    font-size: 22px;
    gap: 12px;
  }
`;

const CtaIcon = styled.span`
  font-size: 1.2em;
  transform: translateX(0);
  transition: all 0.3s ease;
  
  ${CtaButton}:hover & {
    transform: translateX(4px);
  }
`;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  // 테스트용 키보드 단축키 (개발 시에만 사용)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl + M 또는 Cmd + M으로 모달 열기/닫기
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        setIsSignupModalOpen(prev => !prev);
        console.log('모달 토글:', !isSignupModalOpen);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSignupModalOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKakaoLogin = () => {
    // 백엔드의 카카오 OAuth2 로그인 엔드포인트로 리다이렉트
    window.location.href = 'http://localhost:8081/oauth2/authorization/kakao';
  };

  const handleSignupClose = () => {
    setIsSignupModalOpen(false);
  };

  return (
    <LandingPageWrapper>
      <LandingHeader>
        <HeaderContent>
          <LogoButton onClick={() => window.scrollTo({ top: 0 })}>
            <img src={logo} alt="로고" width={116} height={32} />
          </LogoButton>
          <NavMenu>
            <NavButton onClick={() => scrollToSection('service-section')}>
              서비스
            </NavButton>
            <NavButton onClick={() => scrollToSection('testimonial-section')}>
              후기
            </NavButton>
          </NavMenu>
        </HeaderContent>
      </LandingHeader>
      
      <PageContainer>
        {/* 섹션 1: 메인 타이틀 + 배경로고 */}
        <HeroSection>
          <BgLogo src={miniLogo} alt="배경로고" />
          <MainTitle>팜 랜 딩</MainTitle>
          <SubTitle>
            당신의 작물에<br />
            <HighlightText>브랜딩</HighlightText>과 <HighlightText>가격</HighlightText>을 입히는 경험,<br />
            <BrandText>팜랜딩</BrandText>에서 시작하세요.
          </SubTitle>
          <KakaoLoginButton onClick={handleKakaoLogin}>
            <KakaoLoginImg src={kakaoLogin} alt="카카오 로그인" />
          </KakaoLoginButton>
        </HeroSection>

        {/* 섹션 2: 과일/채소 무한 스크롤 - 순차적 로딩 */}
        <FruitSection>
          <FruitInfiniteRow 
            images={fastLoadingFruits} 
            direction="left" 
            speed={20} 
            shadow={true} 
            rowIndex={0}
          />
          <FruitInfiniteRow 
            images={mediumLoadingFruits} 
            direction="right" 
            speed={20} 
            shadow={true} 
            rowIndex={1}
          />
          <FruitInfiniteRow 
            images={slowLoadingFruits} 
            direction="left" 
            speed={20} 
            shadow={true} 
            rowIndex={2}
          />
        </FruitSection>

        <RelativeBgSection>
          <img src={background} alt="배경 패턴" className="section-bg-img" />
          
          {/* 서비스 섹션 헤더 */}
          <SectionHeader>
            <SectionMainTitle>팜랜딩에서 뭘 할 수 있나요?</SectionMainTitle>
            <SectionSubTitle>
              농산물에 브랜딩과 적정 가격을 제안하여<br />
              농장주님의 직거래를 성공으로 이끕니다.
            </SectionSubTitle>
          </SectionHeader>
          
          <ServiceSection id="service-section">
            <ServiceBlock>
              <ServiceCardTitle>
                <ServiceCardMainTitle>브랜딩 서비스</ServiceCardMainTitle>
                <ServiceDescription>상품의 가치를 더할<br />상상 속 브랜드</ServiceDescription>
              </ServiceCardTitle>
              <ServiceCardImg src={card1} alt="브랜딩 서비스 카드" />
            </ServiceBlock>
            <ServiceBlock>
              <ServiceCardTitle>
                <ServiceCardMainTitle>가격 제안 서비스</ServiceCardMainTitle>
                <ServiceDescription>두드리던<br />복잡한 계산은 이제 그만!</ServiceDescription>
              </ServiceCardTitle>
              <ServiceCardImg src={card2} alt="가격 제안 서비스 카드" />
            </ServiceBlock>
          </ServiceSection>
          
          {/* 섹션 구분선 */}
          <SectionDivider />
          
          {/* 후기 섹션 헤더 */}
          <SectionHeader>
            <SectionMainTitle>실제 농장주님들의 후기</SectionMainTitle>
            <SectionSubTitle>
              팜랜딩을 통해 성공적인 직거래를 경험한<br />
              농장주님들의 생생한 이야기를 들어보세요.
            </SectionSubTitle>
          </SectionHeader>
          
          <TestimonialSection id="testimonial-section">
            <Testimonial
              image={iconPeople1}
              name="충남 홍성 청년농부"
              text={'"브랜드 덕분에 직거래 판매가 늘었어요"'}
            />
            <Testimonial
              image={iconPeople2}
              name="경북 김천 캠벨포도 농가"
              text={'"처음 직거래 시작했을 때 가격을\n어떻게 책정할지 몰랐는데 큰 도움이 됐어요."'}
              reverse
              bgColor="#2748BE"
            />
            <Testimonial
              image={iconPeople3}
              name="전남 순천 단호박 농가"
              text={'"판매글 자동 생성 기능 덕에 스마트스토어 등록이 훨씬 쉬워졌어요."'}
            />
          </TestimonialSection>
          
          {/* CTA 섹션 */}
          <CtaSection>
            <CtaTitle>직접 사용해보세요!</CtaTitle>
            <CtaSubtitle>
              농산물에 브랜딩과 적정 가격을 제안하여<br />
              농장주님의 직거래를 성공으로 이끌어보세요.
            </CtaSubtitle>
            <CtaButton onClick={handleKakaoLogin}>
              <CtaButtonText>
                지금 시작하기
                <CtaIcon>→</CtaIcon>
              </CtaButtonText>
            </CtaButton>
          </CtaSection>
          
          <ScrollToTopWrapper>
            <ScrollToTopButton
              onClick={() => {
                // 여러 방법으로 스크롤 시도
                window.scrollTo({ top: 0 });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
                
                // React 루트 엘리먼트도 시도
                const rootElement = document.getElementById('root');
                if (rootElement) {
                  rootElement.scrollTop = 0;
                }
              }}
              aria-label="최상단으로"
            >
              <ScrollToTopIcon src={chevronUp} alt="최상단으로" />
            </ScrollToTopButton>
          </ScrollToTopWrapper>
        </RelativeBgSection>
      </PageContainer>
      
      {/* 회원가입 모달 */}
      <SignupModal 
        isOpen={isSignupModalOpen}
        onClose={handleSignupClose}
        onComplete={() => {
          setIsSignupModalOpen(false);
          navigate('/home');
        }}
        userInfo={{
          userId: '',
          email: '',
          nickname: '',
          membershipType: ''
        }}
      />
    </LandingPageWrapper>
  );
};

export default Home; 