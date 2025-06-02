import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import * as echarts from 'echarts';
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

const ChartSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${slideInUp} 0.8s ease-out 0.4s both;
`;

const ChartTitle = styled.h3`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.2;
  color: #1F41BB;
  margin: 0;
  text-align: center;
`;

const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 12px;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 280px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.08);
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 220px;
  position: relative;
`;

const LegendItem = styled.button<{ color: string; isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  opacity: ${props => props.isActive ? 1 : 0.4};

  &:hover {
    background: rgba(31, 65, 187, 0.05);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background: ${props => props.color};
  border-radius: 50%;
  transition: all 0.3s ease;

  ${LegendItem}:hover & {
    transform: scale(1.2);
  }
`;

const LegendText = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 11px;
  line-height: 1.2;
  color: #6B7280;
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

// 가격 데이터 생성 함수 (30일 데이터)
const generatePriceData = (currentPrice: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // 최저가 (현재가격의 80-90%)
    const minPrice = Math.round(currentPrice * (0.8 + Math.random() * 0.1));
    // 최고가 (현재가격의 110-130%)
    const maxPrice = Math.round(currentPrice * (1.1 + Math.random() * 0.2));
    // 평균가 (최저가와 최고가 사이)
    const avgPrice = Math.round((minPrice + maxPrice) / 2 + (Math.random() - 0.5) * 1000);
    
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      minPrice,
      maxPrice,
      avgPrice
    });
  }
  
  return data;
};

const PriceResultStep: React.FC<PriceResultStepProps> = ({ data, onComplete }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [visibleSeries, setVisibleSeries] = useState({
    min: true,
    max: true,
    avg: true
  });

  useEffect(() => {
    if (chartRef.current) {
      // 기존 차트 인스턴스 제거
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
      }

      // 새 차트 인스턴스 생성
      const chart = echarts.init(chartRef.current, undefined, {
        renderer: 'canvas',
        useDirtyRect: false
      });
      chartInstanceRef.current = chart;

      const priceData = generatePriceData(data.estimatedPrice);

      const option = {
        animation: false,
        grid: {
          top: 20,
          right: 30,
          bottom: 50,
          left: 50
        },
        xAxis: {
          type: 'category',
          data: priceData.map(item => item.date),
          axisLabel: {
            fontSize: 10,
            color: '#9DA3B7',
            interval: 11,
            rotate: 0
          },
          axisLine: {
            lineStyle: {
              color: '#E5E7EB'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10,
            color: '#9DA3B7',
            formatter: (value: number) => `${Math.round(value / 1000)}k`
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#F3F4F6',
              opacity: 0.5
            }
          }
        },
        series: [
          {
            name: '최저가',
            type: 'line',
            data: visibleSeries.min ? priceData.map(item => item.minPrice) : [],
            lineStyle: {
              color: '#10B981',
              width: 2
            },
            itemStyle: {
              color: '#10B981'
            },
            symbol: 'circle',
            symbolSize: 4,
            smooth: true,
            showSymbol: false
          },
          {
            name: '최고가',
            type: 'line',
            data: visibleSeries.max ? priceData.map(item => item.maxPrice) : [],
            lineStyle: {
              color: '#F6543E',
              width: 2
            },
            itemStyle: {
              color: '#F6543E'
            },
            symbol: 'circle',
            symbolSize: 4,
            smooth: true,
            showSymbol: false
          },
          {
            name: '평균가',
            type: 'line',
            data: visibleSeries.avg ? priceData.map(item => item.avgPrice) : [],
            lineStyle: {
              color: '#1F41BB',
              width: 3
            },
            itemStyle: {
              color: '#1F41BB'
            },
            symbol: 'circle',
            symbolSize: 5,
            smooth: true,
            showSymbol: false
          }
        ],
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          textStyle: {
            color: '#374151',
            fontSize: 12
          },
          formatter: (params: any) => {
            const date = params[0]?.axisValue;
            if (!date) return '';
            
            let content = `<div style="font-weight: 600; margin-bottom: 8px;">${date}</div>`;
            
            params.forEach((param: any) => {
              if (param.seriesName && param.value !== null && param.value !== undefined) {
                const seriesKey = param.seriesName === '최저가' ? 'min' : 
                                param.seriesName === '최고가' ? 'max' : 'avg';
                if (visibleSeries[seriesKey]) {
                  content += `
                    <div style="display: flex; align-items: center; margin-bottom: 4px;">
                      <div style="width: 8px; height: 8px; background: ${param.color}; border-radius: 50%; margin-right: 8px;"></div>
                      <span style="flex: 1;">${param.seriesName}</span>
                      <span style="font-weight: 600;">${param.value.toLocaleString()}원</span>
                    </div>
                  `;
                }
              }
            });
            
            return content;
          }
        }
      };

      chart.setOption(option, true);
      chart.resize();

      // 리사이즈 핸들러
      const handleResize = () => {
        chart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartInstanceRef.current) {
          chartInstanceRef.current.dispose();
          chartInstanceRef.current = null;
        }
      };
    }
  }, [data.estimatedPrice, visibleSeries]);

  const toggleSeries = (seriesKey: keyof typeof visibleSeries) => {
    setVisibleSeries(prev => ({
      ...prev,
      [seriesKey]: !prev[seriesKey]
    }));
  };

  return (
    <Container>
      <TitleSection>
        <Title>예상 가격이{'\n'}산출되었습니다!</Title>
        
        <PriceSection>
          <PriceHeader>
            <PriceIcon src={iconGraph} alt="가격" />
            <PriceLabel>예상 가격</PriceLabel>
          </PriceHeader>
          <PriceDisplay>
            <PriceValue>{data.estimatedPrice.toLocaleString()}원</PriceValue>
          </PriceDisplay>
        </PriceSection>
      </TitleSection>

      <ChartSection>
        <ChartTitle>5년간 가격 동향</ChartTitle>
        <LegendContainer>
          <LegendItem 
            color="#10B981"
            isActive={visibleSeries.min}
            onClick={() => toggleSeries('min')}
          >
            <LegendColor color="#10B981" />
            <LegendText>최저가</LegendText>
          </LegendItem>
          <LegendItem 
            color="#F6543E"
            isActive={visibleSeries.max}
            onClick={() => toggleSeries('max')}
          >
            <LegendColor color="#F6543E" />
            <LegendText>최고가</LegendText>
          </LegendItem>
          <LegendItem 
            color="#1F41BB"
            isActive={visibleSeries.avg}
            onClick={() => toggleSeries('avg')}
          >
            <LegendColor color="#1F41BB" />
            <LegendText>평균가</LegendText>
          </LegendItem>
        </LegendContainer>
        <ChartContainer>
          <ChartWrapper ref={chartRef} />
        </ChartContainer>
      </ChartSection>

      <CompleteButton onClick={onComplete}>
        완료
      </CompleteButton>
    </Container>
  );
};

export default PriceResultStep; 