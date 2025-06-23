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
  max-width: 500px;
  padding: 0 20px;
  box-sizing: border-box;
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

const PriceExplanation = styled.div`
  width: 100%;
  padding: 16px;
  background: rgba(31, 65, 187, 0.05);
  border-radius: 8px;
  border-left: 4px solid #1F41BB;
  margin-top: 12px;
  animation: ${slideInUp} 0.8s ease-out 0.3s both;
`;

const PriceExplanationText = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 1.5;
  color: #374151;
  margin: 0;
  text-align: left;
`;

// 정보 섹션 스타일 (상세조회와 동일)
const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  animation: ${slideInUp} 0.8s ease-out 0.1s both;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const InfoLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
  color: #6B7280;
`;

const InfoValue = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.2;
  color: #1F2937;
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
  line-height: 1.18;
  color: #000000;
  text-align: center;
  margin: 0;
  margin-bottom: 8px;
`;

const ErrorMessage = styled.div`
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #991B1B;
  margin-bottom: 12px;
  white-space: pre-line;
`;

const DataSourceNotice = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #856404;
  text-align: center;
  font-family: 'Inter', sans-serif;
`;

const NoDataMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666;
  font-size: 14px;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  
  div:first-child {
    font-size: 16px;
    font-weight: 500;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 440px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #9CA3AF;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 480px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.08);
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 440px;
  position: relative;
`;

const CompleteButton = styled.button`
  width: 100%;
  max-width: 400px;
  padding: 18px;
  background: #1F41BB;
  border: none;
  border-radius: 10px;
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 17px;
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
  productId: number | null;
  garakCode: string;
  productName: string;
  grade: string;
  harvestDate: Date | null;
  estimatedPrice: number;
}

interface PriceResultStepProps {
  data: PriceQuoteData;
  onComplete: () => void;
}

// 가격 데이터를 가져오는 함수 (5년간 연도별 데이터)
const fetchPriceData = async (data: PriceQuoteData) => {
  try {
    // 필요한 데이터가 모두 있는지 확인
    if (!data.garakCode || !data.harvestDate || !data.grade) {
      throw new Error('필수 가격 조회 정보가 누락되었습니다.');
    }

    // 동적 import로 서비스 로드
    const { PriceDataService } = await import('../../../api/priceDataService');
    
    const priceData = await PriceDataService.lookupPrice({
      garakCode: data.garakCode,
      targetDate: data.harvestDate.toISOString().split('T')[0],
      grade: data.grade as '특' | '상' | '중' | '하'
    });
    
    return priceData;
    
  } catch (error) {
    console.error('가격 데이터 조회 실패:', error);
    throw error; // 에러를 다시 던져서 상위에서 처리
  }
};

const PriceResultStep: React.FC<PriceResultStepProps> = ({ data, onComplete }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [priceChartData, setPriceChartData] = useState<any[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);
  const [priceDataSource, setPriceDataSource] = useState<'api' | 'estimated'>('api');

  const handleComplete = async () => {
    try {
      // 가격 제안 결과 저장
      const { PriceQuoteService } = await import('../../../api/priceQuoteService');
      
      // 최대/최소값 계산
      const prices = priceChartData.map(item => item.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      
      const saveRequest = {
        garakCode: data.garakCode,
        productName: data.productName,
        grade: data.grade,
        harvestDate: data.harvestDate!.toISOString().split('T')[0],
        unit: 'kg',
        quantity: 10,
        finalPrice: data.estimatedPrice,
        minPrice,
        maxPrice,
        avgPrice,
        yearlyPriceData: PriceQuoteService.yearlyPriceDataToJson(priceChartData),
        lookupDate: new Date().toISOString().split('T')[0]
      };
      
      await PriceQuoteService.savePriceQuoteResult(saveRequest);
      console.log('가격 제안 결과 저장 완료');
      
    } catch (error) {
      console.error('가격 제안 결과 저장 실패:', error);
      // 저장 실패해도 계속 진행 (사용자 경험 방해하지 않음)
    }
    
    onComplete();
  };

  // 날짜 포맷팅 함수
  const formatDateForTitle = (date: Date | null) => {
    if (!date) return '';
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일자 `;
  };

  // 등급 표시 텍스트 변환 함수 (상세조회와 동일)
  const getGradeDisplayText = (grade: string) => {
    const gradeMap: { [key: string]: string } = {
      '특': '특급(최고급)',
      '상': '상급(우수)',
      '중': '중급(보통)',
      '하': '하급(일반)'
    };
    return gradeMap[grade] || grade;
  };

  // 날짜 포맷팅 함수 (상세조회와 동일)
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}.`;
  };

  // 가격 데이터 로드
  useEffect(() => {
    const loadPriceData = async () => {
      setIsLoadingChart(true);
      setChartError(null);
      
      try {
        const apiPriceData = await fetchPriceData(data);
        
        if (apiPriceData && apiPriceData.yearlyPrices && apiPriceData.yearlyPrices.length > 0) {
          // API 데이터를 년도 순으로 정렬 
          const sortedData = [...apiPriceData.yearlyPrices].sort((a, b) => parseInt(a.year) - parseInt(b.year));
          setPriceChartData(sortedData);
          
          // 품목명이 "품목 정보 조회 실패"나 "품목명 조회 실패"인 경우 추정 데이터로 표시
          if (apiPriceData.productName?.includes('조회 실패') || 
              apiPriceData.productName?.includes('실패')) {
            setPriceDataSource('estimated');
          } else {
            setPriceDataSource('api');
          }
        } else {
          throw new Error('유효한 가격 데이터를 받지 못했습니다.');
        }
      } catch (error) {
        console.error('가격 데이터 로드 실패:', error);
        setChartError(
          '가락시장 가격 데이터를 불러올 수 없습니다.\n' +
          '네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.'
        );
        // 에러 시 빈 배열로 설정
        setPriceChartData([]);
        setPriceDataSource('estimated');
      } finally {
        setIsLoadingChart(false);
      }
    };

    loadPriceData();
  }, [data]);

  // 차트 렌더링
  useEffect(() => {
    if (chartRef.current && priceChartData.length > 0) {
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

      // Y축 범위 계산 (가독성 향상)
      const prices = priceChartData.map(d => d.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const padding = Math.max((maxPrice - minPrice) * 0.15, 1000);
      const yAxisMin = Math.max(0, minPrice - padding);
      const yAxisMax = maxPrice + padding;

      const option = {
        animation: true,
        animationDuration: 1200,
        animationEasing: 'cubicOut' as const,
        grid: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 15,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: priceChartData.map(item => item.year),
          boundaryGap: false,
          axisLabel: {
            fontSize: 14,
            color: '#333333',
            fontWeight: 600,
            margin: 10
          },
          axisLine: {
            lineStyle: {
              color: '#E8E8E8',
              width: 2
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          min: yAxisMin,
          max: yAxisMax,
          axisLabel: {
            fontSize: 11,
            color: '#666666',
            fontWeight: 500,
            margin: 4,
            formatter: (value: number) => {
              return `${Math.round(value / 1000)}k`;
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#F0F0F0',
              width: 1,
              type: 'solid'
            }
          }
        },
        series: [
          {
            name: '연도별 가격',
            type: 'line',
            data: priceChartData.map(item => item.price),
            lineStyle: {
              color: '#1F41BB',
              width: 6,
              shadowColor: 'rgba(31, 65, 187, 0.3)',
              shadowBlur: 12
            },
            itemStyle: {
              color: '#1F41BB',
              borderColor: '#FFFFFF',
              borderWidth: 3,
              shadowBlur: 8,
              shadowColor: 'rgba(31, 65, 187, 0.4)'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(31, 65, 187, 0.25)'
                }, {
                  offset: 0.7, color: 'rgba(31, 65, 187, 0.1)'
                }, {
                  offset: 1, color: 'rgba(31, 65, 187, 0.02)'
                }]
              }
            },
            symbol: 'circle',
            symbolSize: 18,
            smooth: true,
            showSymbol: true,
            emphasis: {
              focus: 'series',
              itemStyle: {
                shadowBlur: 15,
                shadowColor: 'rgba(31, 65, 187, 0.6)',
                scale: 1.2
              }
            },
            markPoint: {
              data: [
                {
                  type: 'max',
                  name: '최고가',
                  itemStyle: {
                    color: '#FF6B6B',
                    borderColor: '#FFFFFF',
                    borderWidth: 3,
                    shadowBlur: 10,
                    shadowColor: 'rgba(255, 107, 107, 0.4)'
                  },
                  label: {
                    show: true,
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: 12,
                    padding: [6, 10],
                    formatter: () => '최대'
                  }
                },
                {
                  type: 'min', 
                  name: '최저가',
                  itemStyle: {
                    color: '#51CF66',
                    borderColor: '#FFFFFF',
                    borderWidth: 3,
                    shadowBlur: 10,
                    shadowColor: 'rgba(81, 207, 102, 0.4)'
                  },
                  label: {
                    show: true,
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: 12,
                    padding: [6, 10],
                    formatter: () => '최소'
                  }
                }
              ]
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          borderColor: '#1F41BB',
          borderWidth: 1,
          borderRadius: 12,
          padding: [16, 20],
          textStyle: {
            color: '#333333',
            fontSize: 13
          },
          axisPointer: {
            type: 'cross',
            lineStyle: {
              color: '#1F41BB',
              width: 1,
              type: 'dashed'
            }
          },
          formatter: (params: any) => {
            const yearData = params[0];
            if (!yearData) return '';
            
            return `
              <div style="font-weight: bold; margin-bottom: 10px; color: #1F41BB; font-size: 14px;">
                ${yearData.axisValue}년 시장가격 (10kg 기준)
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center;">
                  <div style="width: 10px; height: 10px; background: ${yearData.color}; border-radius: 50%; margin-right: 10px; box-shadow: 0 2px 4px rgba(31, 65, 187, 0.3);"></div>
                  <span style="color: #666;">평균가격</span>
                </div>
                <span style="font-weight: bold; color: #1F41BB; font-size: 15px; margin-left: 20px;">${Math.round(yearData.value).toLocaleString()}원</span>
              </div>
            `;
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
  }, [priceChartData]);

  return (
          <Container>
        <TitleSection>
          <Title>{data.productName}의 적정 가격이{'\n'}산출되었습니다!</Title>
          
          <InfoSection>
            <InfoItem>
              <InfoLabel>품목명</InfoLabel>
              <InfoValue>{data.productName}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>등급</InfoLabel>
              <InfoValue>{getGradeDisplayText(data.grade)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>수확일</InfoLabel>
              <InfoValue>{formatDate(data.harvestDate)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>기준 수량</InfoLabel>
              <InfoValue>10kg</InfoValue>
            </InfoItem>
          </InfoSection>
          
          <PriceSection>
            <PriceHeader>
              <PriceIcon src={iconGraph} alt="가격" />
              <PriceLabel>적정 가격(10kg 기준)</PriceLabel>
            </PriceHeader>
            <PriceDisplay>
              <PriceValue>{Math.round(data.estimatedPrice).toLocaleString()}원</PriceValue>
            </PriceDisplay>
            <PriceExplanation>
              <PriceExplanationText>
                해당 가격은 출하일 기준 5개년 평균 "도매가"를 기준으로 산출된 적정가입니다. 이 가격 이상으로 판매하시는 것을 권장드립니다.
              </PriceExplanationText>
            </PriceExplanation>
          </PriceSection>
        </TitleSection>

      <ChartSection>
        <ChartTitle>{formatDateForTitle(data.harvestDate)}5년간 시장 가격 추이</ChartTitle>
        {priceDataSource === 'estimated' && (
          <DataSourceNotice>
            ⚠️ 가락시장 실시간 데이터 조회가 어려워 추정 데이터를 표시하고 있습니다.
          </DataSourceNotice>
        )}
        {chartError && (
          <ErrorMessage>{chartError}</ErrorMessage>
        )}
        <ChartContainer>
          {isLoadingChart ? (
            <LoadingMessage>가격 데이터를 불러오는 중...</LoadingMessage>
          ) : priceChartData.length === 0 ? (
            <NoDataMessage>
              <div>📊 가격 데이터를 표시할 수 없습니다</div>
              <div>잠시 후 다시 시도해주세요</div>
            </NoDataMessage>
          ) : (
            <ChartWrapper ref={chartRef} />
          )}
        </ChartContainer>
      </ChartSection>

      <CompleteButton onClick={handleComplete}>
        완료
      </CompleteButton>
    </Container>
  );
};

export default PriceResultStep; 