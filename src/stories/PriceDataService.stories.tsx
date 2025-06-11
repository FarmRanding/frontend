import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PriceDataService, PriceDataRequest, PriceDataResponse } from '../api/priceDataService';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  padding: 20px;
  font-family: 'Inter', sans-serif;
`;

const Title = styled.h2`
  color: #1F41BB;
  margin-bottom: 20px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #1F41BB;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #1a37a0;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const Result = styled.div`
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
`;

const ErrorBox = styled.div`
  padding: 15px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #991b1b;
`;

const PriceInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
`;

const PriceCard = styled.div`
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const PriceLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 5px;
`;

const PriceValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1F41BB;
`;

const YearlyPrices = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
`;

const YearCard = styled.div`
  padding: 10px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  text-align: center;
`;

const Year = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 5px;
`;

const YearPrice = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

interface PriceDataDemoProps {}

const PriceDataDemo: React.FC<PriceDataDemoProps> = () => {
  const [request, setRequest] = useState<PriceDataRequest>({
    garakCode: '15100',
    targetDate: '2024-02-15',
    grade: '특'
  });

  const [result, setResult] = useState<PriceDataResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await PriceDataService.lookupPrice(request);
      setResult(response);
    } catch (err: any) {
      setError(err.message || '가격 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>🌾 가락시장 가격 조회 서비스</Title>
      
      <Form>
        <InputGroup>
          <Label>가락시장 품목 코드</Label>
          <Input
            type="text"
            value={request.garakCode}
            onChange={(e) => setRequest({...request, garakCode: e.target.value})}
            placeholder="예: 15100 (고구마)"
          />
        </InputGroup>

        <InputGroup>
          <Label>조회 기준일</Label>
          <Input
            type="date"
            value={request.targetDate}
            onChange={(e) => setRequest({...request, targetDate: e.target.value})}
          />
        </InputGroup>

        <InputGroup>
          <Label>등급</Label>
          <Select
            value={request.grade}
            onChange={(e) => setRequest({...request, grade: e.target.value as any})}
          >
            <option value="특">특급</option>
            <option value="상">상급</option>
            <option value="중">중급</option>
            <option value="하">하급</option>
          </Select>
        </InputGroup>

        <Button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? '조회 중...' : '가격 조회'}
        </Button>
      </Form>

      {error && (
        <ErrorBox>{error}</ErrorBox>
      )}

      {result && (
        <Result>
          <h3>📊 조회 결과</h3>
          
          <PriceInfo>
            <PriceCard>
              <PriceLabel>평균 가격</PriceLabel>
              <PriceValue>{PriceDataService.formatPrice(result.averagePrice)}원</PriceValue>
            </PriceCard>
            
            <PriceCard>
              <PriceLabel>추천 가격</PriceLabel>
              <PriceValue>{PriceDataService.formatPrice(result.recommendedPrice)}원</PriceValue>
            </PriceCard>
          </PriceInfo>

          <div style={{ marginBottom: '15px' }}>
            <strong>품목:</strong> {result.productName} ({result.grade})<br/>
            <strong>단위:</strong> {result.unit}<br/>
            <strong>기간:</strong> {result.period}
          </div>

          <h4>📈 연도별 가격</h4>
          <YearlyPrices>
            {result.yearlyPrices.map((item, index) => (
              <YearCard key={index}>
                <Year>{item.year}년</Year>
                <YearPrice>{PriceDataService.formatPrice(item.price)}원</YearPrice>
              </YearCard>
            ))}
          </YearlyPrices>
        </Result>
      )}
    </Container>
  );
};

const meta: Meta<typeof PriceDataDemo> = {
  title: 'API/PriceDataService',
  component: PriceDataDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### 가락시장 가격 조회 서비스

가락시장 공공데이터 API를 통해 농산물 가격 정보를 조회하는 서비스입니다.

#### 주요 기능
- **실시간 가격 조회**: 가락시장 API 연동
- **5년간 추이**: 연도별 가격 데이터 제공
- **등급별 조회**: 특/상/중/하급 등급 지원
- **에러 처리**: 상세한 에러 메시지 제공

#### 사용 예시
\`\`\`typescript
const priceData = await PriceDataService.lookupPrice({
  garakCode: '15100',        // 고구마 코드
  targetDate: '2024-02-15',  // 조회 기준일
  grade: '특'                // 등급
});
\`\`\`

#### 응답 데이터
- 5년간 연도별 가격
- 평균 가격 및 추천 가격
- 품목 상세 정보
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof PriceDataDemo>;

export const Default: Story = {
  name: '🌾 기본 사용',
  render: () => <PriceDataDemo />
};

export const WithExampleData: Story = {
  name: '📊 예시 데이터',
  render: () => {
    const [showResult, setShowResult] = useState(false);
    
    const exampleResult: PriceDataResponse = {
      productName: '고구마',
      grade: '특급',
      unit: '10키로상자(특)',
      period: '02월15일 ~ 02월15일',
      averagePrice: 42500,
      recommendedPrice: 42500,
      standardPrice: 40245.68,
      yearlyPrices: [
        { year: '2024', price: 42008 },
        { year: '2023', price: 32289 },
        { year: '2022', price: 46284 },
        { year: '2021', price: 56537 },
        { year: '2020', price: 32339 }
      ]
    };

    return (
      <Container>
        <Title>📊 예시 응답 데이터</Title>
        
        <Button onClick={() => setShowResult(!showResult)}>
          {showResult ? '결과 숨기기' : '예시 결과 보기'}
        </Button>

        {showResult && (
          <Result style={{ marginTop: '20px' }}>
            <h3>📊 조회 결과 (예시)</h3>
            
            <PriceInfo>
              <PriceCard>
                <PriceLabel>평균 가격</PriceLabel>
                <PriceValue>{PriceDataService.formatPrice(exampleResult.averagePrice)}원</PriceValue>
              </PriceCard>
              
              <PriceCard>
                <PriceLabel>추천 가격</PriceLabel>
                <PriceValue>{PriceDataService.formatPrice(exampleResult.recommendedPrice)}원</PriceValue>
              </PriceCard>
            </PriceInfo>

            <div style={{ marginBottom: '15px' }}>
              <strong>품목:</strong> {exampleResult.productName} ({exampleResult.grade})<br/>
              <strong>단위:</strong> {exampleResult.unit}<br/>
              <strong>기간:</strong> {exampleResult.period}
            </div>

            <h4>📈 연도별 가격</h4>
            <YearlyPrices>
              {exampleResult.yearlyPrices.map((item, index) => (
                <YearCard key={index}>
                  <Year>{item.year}년</Year>
                  <YearPrice>{PriceDataService.formatPrice(item.price)}원</YearPrice>
                </YearCard>
              ))}
            </YearlyPrices>
          </Result>
        )}
      </Container>
    );
  }
}; 