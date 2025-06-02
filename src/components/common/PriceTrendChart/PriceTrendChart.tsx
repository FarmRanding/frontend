import React, { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import * as echarts from 'echarts';

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

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const ChartContainer = styled.div`
  width: 280px;
  height: 200px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 
    0px 8px 32px rgba(0, 0, 0, 0.08),
    0px 1px 0px rgba(255, 255, 255, 0.5) inset;
  backdrop-filter: blur(20px);
  padding: 16px;
  box-sizing: border-box;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 0.6s ease-out;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -200%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0px 16px 48px rgba(0, 0, 0, 0.12),
      0px 1px 0px rgba(255, 255, 255, 0.6) inset;
    
    &::before {
      left: 100%;
    }
  }
`;

const ChartHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
`;

const ChartTitle = styled.h3`
  font-family: 'Jalnan 2', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #1F2937;
  margin: 0;
  line-height: 1.2;
`;

const ChartSubtitle = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #6B7280;
  line-height: 1.2;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const CurrentPrice = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1F41BB;
`;

const PriceChange = styled.span<{ isPositive: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.isPositive ? '#10B981' : '#F6543E'};
  background: ${props => props.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(246, 84, 62, 0.1)'};
  padding: 2px 6px;
  border-radius: 4px;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 120px;
  position: relative;
`;

interface PriceTrendData {
  cropName: string;
  variety: string;
  currentPrice: number;
  priceChange: number;
  data: Array<{
    date: string;
    price: number;
  }>;
}

interface PriceTrendChartProps {
  data: PriceTrendData;
  className?: string;
}

const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ data, className }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

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

      const isPositiveTrend = data.priceChange >= 0;
      const lineColor = isPositiveTrend ? '#10B981' : '#F6543E';
      const areaColor = isPositiveTrend 
        ? 'rgba(16, 185, 129, 0.1)' 
        : 'rgba(246, 84, 62, 0.1)';

      const option = {
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut' as const,
        grid: {
          top: 10,
          right: 10,
          bottom: 25,
          left: 30
        },
        xAxis: {
          type: 'category' as const,
          data: data.data.map(item => {
            const date = new Date(item.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }),
          axisLabel: {
            fontSize: 9,
            color: '#9CA3AF',
            interval: Math.floor(data.data.length / 4)
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value' as const,
          axisLabel: {
            fontSize: 9,
            color: '#9CA3AF',
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
              color: 'rgba(156, 163, 175, 0.2)',
              width: 1
            }
          }
        },
        series: [
          {
            data: data.data.map(item => item.price),
            type: 'line' as const,
            smooth: true,
            lineStyle: {
              color: lineColor,
              width: 2.5
            },
            itemStyle: {
              color: lineColor
            },
            symbol: 'circle' as const,
            symbolSize: 4,
            showSymbol: false,
            areaStyle: {
              color: {
                type: 'linear' as const,
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: areaColor
                  },
                  {
                    offset: 1,
                    color: 'rgba(255, 255, 255, 0)'
                  }
                ]
              }
            }
          }
        ],
        tooltip: {
          trigger: 'axis' as const,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: lineColor,
          borderWidth: 1,
          textStyle: {
            color: '#374151',
            fontSize: 11
          },
          formatter: (params: any) => {
            const data = params[0];
            return `${data.name}<br/>가격: ${data.value.toLocaleString()}원`;
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
  }, [data]);

  const formatPriceChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <ChartContainer className={className}>
      <ChartHeader>
        <ChartTitle>{data.cropName}</ChartTitle>
        <ChartSubtitle>{data.variety}</ChartSubtitle>
        <PriceInfo>
          <CurrentPrice>{data.currentPrice.toLocaleString()}원</CurrentPrice>
          <PriceChange isPositive={data.priceChange >= 0}>
            {formatPriceChange(data.priceChange)}
          </PriceChange>
        </PriceInfo>
      </ChartHeader>
      <ChartWrapper ref={chartRef} />
    </ChartContainer>
  );
};

export default PriceTrendChart; 