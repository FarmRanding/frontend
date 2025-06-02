import React from 'react';
import styled, { keyframes } from 'styled-components';
import iconProfile from '../../../assets/icon-profile.svg';
import iconFarm from '../../../assets/icon_farm.svg';
import iconLocation from '../../../assets/icon-location.png';
import iconMypage from '../../../assets/icon-mypage.svg';

// 애니메이션
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PersonalInfoCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  width: 100%;
  max-width: 370px;
  background: #FFFFFF;
  border-radius: 20px;
  box-shadow: 
    0 4px 20px rgba(31, 65, 187, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(31, 65, 187, 0.08);
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1F41BB 0%, #4F46E5 50%, #818CF8 100%);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.7s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 32px rgba(31, 65, 187, 0.12),
      0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: rgba(31, 65, 187, 0.15);
    
    &::after {
      left: 100%;
    }
  }
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 12px 0;
  box-sizing: border-box;
  position: relative;
  transition: all 0.3s ease;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(31, 65, 187, 0.08);
  }

  &:hover {
    transform: translateX(4px);
    background: rgba(31, 65, 187, 0.02);
    border-radius: 12px;
    margin: 0 -8px;
    padding: 12px 8px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  min-width: 140px;
`;

const IconContainer = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(31, 65, 187, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%);
  border-radius: 12px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(31, 65, 187, 0.1);
    border-radius: 50%;
    transition: all 0.3s ease;
    transform: translate(-50%, -50%);
  }

  ${InfoRow}:hover & {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(31, 65, 187, 0.15);
    
    &::before {
      width: 100%;
      height: 100%;
    }
  }
`;

const IconImage = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1653%) hue-rotate(221deg) brightness(96%) contrast(91%);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  ${InfoRow}:hover & {
    transform: scale(1.1);
  }
`;

const LabelText = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 1.2;
  color: #1F41BB;
  text-align: left;
  white-space: nowrap;
  font-weight: 500;
`;

const Divider = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 1.2;
  color: rgba(31, 65, 187, 0.3);
  text-align: center;
  flex-shrink: 0;
  margin: 0 8px;
`;

const ValueText = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.4;
  color: #334155;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
  transition: color 0.3s ease;

  ${InfoRow}:hover & {
    color: #1F41BB;
  }
`;

export interface PersonalInfoData {
  name: string;
  farmName: string;
  location: string;
}

interface PersonalInfoProps {
  data: PersonalInfoData;
  className?: string;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  data,
  className,
}) => {
  const infoItems = [
    {
      icon: iconProfile,
      label: '이름',
      value: data.name,
      alt: '프로필'
    },
    {
      icon: iconFarm,
      label: '농가명',
      value: data.farmName,
      alt: '농가'
    },
    {
      icon: iconLocation,
      label: '농가 위치',
      value: data.location,
      alt: '위치'
    }
  ];

  return (
    <PersonalInfoCard className={className}>
      {infoItems.map((item, index) => (
        <InfoRow key={index}>
          <LeftSection>
            <IconContainer>
              <IconImage src={item.icon} alt={item.alt} />
            </IconContainer>
            <LabelText>{item.label}</LabelText>
          </LeftSection>
          <Divider>•</Divider>
          <ValueText>{item.value}</ValueText>
        </InfoRow>
      ))}
    </PersonalInfoCard>
  );
};

export default PersonalInfo; 