import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PriceQuoteService, type PriceQuoteSaveRequest, type PriceQuoteResponse } from '../api/priceQuoteService';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  padding: 20px;
  font-family: 'Inter', sans-serif;
`;

const Title = styled.h2`
  color: #1F41BB;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const SectionTitle = styled.h3`
  color: #374151;
  margin-bottom: 15px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
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

const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-height: 100px;
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

const SuccessBox = styled.div`
  padding: 15px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  color: #166534;
`;

const HistoryItem = styled.div`
  padding: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 10px;
  background: white;
`;

const HistoryTitle = styled.div`
  font-weight: 600;
  color: #1F41BB;
  margin-bottom: 8px;
`;

const HistoryDetails = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const PriceValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1F41BB;
  margin-top: 5px;
`;

interface PriceQuoteTestProps {}

const PriceQuoteTest: React.FC<PriceQuoteTestProps> = () => {
  const [saveRequest, setSaveRequest] = useState<PriceQuoteSaveRequest>({
    garakCode: '15100',
    productName: '고구마',
    grade: '특',
    harvestDate: '2024-02-15',
    unit: '10키로상자',
    quantity: 1,
    finalPrice: 45531,
    minPrice: 31113,
    maxPrice: 64863,
    avgPrice: 45531,
    yearlyPriceData: JSON.stringify([
      { year: '2020', price: 64863 },
      { year: '2021', price: 51798 },
      { year: '2022', price: 33694 },
      { year: '2023', price: 31113 },
      { year: '2024', price: 36187 }
    ]),
    lookupDate: '2024-06-09'
  });

  const [saveResult, setSaveResult] = useState<PriceQuoteResponse | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [historyResult, setHistoryResult] = useState<PriceQuoteResponse[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaveLoading(true);
    setSaveError(null);
    setSaveResult(null);

    try {
      const response = await PriceQuoteService.savePriceQuoteResult(saveRequest);
      setSaveResult(response);
    } catch (err: any) {
      setSaveError(err.message || '가격 제안 저장에 실패했습니다.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLoadHistory = async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    setHistoryResult(null);

    try {
      const response = await PriceQuoteService.getMyPriceQuotes();
      setHistoryResult(response);
    } catch (err: any) {
      setHistoryError(err.message || '가격 제안 이력 조회에 실패했습니다.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await PriceQuoteService.deletePriceQuote(id);
      setHistoryResult(prev => prev ? prev.filter(item => item.id !== id) : null);
    } catch (err: any) {
      alert(`삭제 실패: ${err.message}`);
    }
  };

  return (
    <Container>
      <Title>🌾 가격 제안 서비스 테스트</Title>
      
      <Section>
        <SectionTitle>📝 가격 제안 결과 저장</SectionTitle>
        
        <Form>
          <InputGroup>
            <Label>품목명</Label>
            <Input
              value={saveRequest.productName}
              onChange={(e) => setSaveRequest({...saveRequest, productName: e.target.value})}
              placeholder="고구마"
            />
          </InputGroup>

          <InputGroup>
            <Label>등급</Label>
            <Input
              value={saveRequest.grade}
              onChange={(e) => setSaveRequest({...saveRequest, grade: e.target.value})}
              placeholder="특"
            />
          </InputGroup>

          <InputGroup>
            <Label>최종 가격 (원)</Label>
            <Input
              type="number"
              value={saveRequest.finalPrice}
              onChange={(e) => setSaveRequest({...saveRequest, finalPrice: Number(e.target.value)})}
            />
          </InputGroup>

          <InputGroup>
            <Label>5년간 가격 데이터 (JSON)</Label>
            <TextArea
              value={saveRequest.yearlyPriceData}
              onChange={(e) => setSaveRequest({...saveRequest, yearlyPriceData: e.target.value})}
              placeholder='[{"year":"2020","price":64863}]'
            />
          </InputGroup>

          <Button onClick={handleSave} disabled={saveLoading}>
            {saveLoading ? '저장 중...' : '가격 제안 저장'}
          </Button>
        </Form>

        {saveError && (
          <ErrorBox>{saveError}</ErrorBox>
        )}

        {saveResult && (
          <SuccessBox>
            <h4>✅ 저장 완료!</h4>
            <div><strong>ID:</strong> {saveResult.id}</div>
            <div><strong>품목:</strong> {saveResult.productName}</div>
            <div><strong>최종가격:</strong> {saveResult.finalPrice?.toLocaleString()}원</div>
          </SuccessBox>
        )}
      </Section>

      <Section>
        <SectionTitle>📋 가격 제안 이력 조회</SectionTitle>
        
        <Button onClick={handleLoadHistory} disabled={historyLoading}>
          {historyLoading ? '조회 중...' : '이력 조회'}
        </Button>

        {historyError && (
          <ErrorBox style={{ marginTop: '15px' }}>{historyError}</ErrorBox>
        )}

        {historyResult && (
          <div style={{ marginTop: '20px' }}>
            <h4>📈 가격 제안 이력 ({historyResult.length}개)</h4>
            
            {historyResult.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                저장된 가격 제안이 없습니다.
              </div>
            ) : (
              historyResult.map((item) => (
                <HistoryItem key={item.id}>
                  <HistoryTitle>
                    {item.productName} ({item.grade}급)
                    <Button 
                      style={{ 
                        marginLeft: '10px', 
                        padding: '4px 8px', 
                        fontSize: '12px',
                        background: '#dc2626'
                      }}
                      onClick={() => handleDelete(item.id)}
                    >
                      삭제
                    </Button>
                  </HistoryTitle>
                  <HistoryDetails>
                    수확일: {item.harvestDate} | 
                    단위: {item.unit} | 
                    수량: {item.quantity}
                  </HistoryDetails>
                  <PriceValue>
                    {item.finalPrice?.toLocaleString()}원
                  </PriceValue>
                  <HistoryDetails style={{ marginTop: '8px' }}>
                    생성일: {new Date(item.createdAt).toLocaleString('ko-KR')}
                  </HistoryDetails>
                </HistoryItem>
              ))
            )}
          </div>
        )}
      </Section>
    </Container>
  );
};

const meta: Meta<typeof PriceQuoteTest> = {
  title: 'API/PriceQuoteService',
  component: PriceQuoteTest,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### 가격 제안 서비스 테스트

가격 제안 결과 저장, 조회, 삭제 기능을 테스트할 수 있는 컴포넌트입니다.

#### 주요 기능
- **가격 제안 저장**: 완전한 가격 제안 결과를 데이터베이스에 저장
- **이력 조회**: 사용자의 모든 가격 제안 이력 조회
- **상세 조회**: 특정 가격 제안의 상세 정보 조회
- **삭제**: 가격 제안 이력 삭제

#### 사용 방법
1. 가격 제안 데이터를 입력하고 "가격 제안 저장" 클릭
2. "이력 조회" 버튼으로 저장된 이력 확인
3. 각 항목의 "삭제" 버튼으로 개별 삭제 가능

#### API 연동
- POST /api/v1/price-quotes/save-result
- GET /api/v1/price-quotes
- DELETE /api/v1/price-quotes/{id}
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof PriceQuoteTest>;

export const Default: Story = {
  name: '🌾 기본 사용',
  render: () => <PriceQuoteTest />
}; 