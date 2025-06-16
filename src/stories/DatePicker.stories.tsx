import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DatePicker from '../components/common/DatePicker/DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: 'rgba(0, 0, 0, 0.5)' },
        { name: 'light', value: '#F2F8FD' },
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 DatePicker
export const Default: Story = {
  name: '기본 달력',
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(true);

    return (
      <div style={{ width: '402px', margin: '0 auto' }}>
        {showPicker && (
          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date);
              console.log('선택된 날짜:', date);
            }}
            onClose={() => {
              setShowPicker(false);
              // 스토리북에서는 다시 보여주기 위해 재설정
              setTimeout(() => setShowPicker(true), 1000);
            }}
          />
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '모바일 친화적인 이쁜 달력 컴포넌트입니다. 하단에서 슬라이드업 되며, 백드롭 블러 효과가 적용되어 있습니다.',
      },
    },
  },
};

// 오늘 날짜가 선택된 경우
export const WithSelectedDate: Story = {
  name: '날짜 선택됨',
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [showPicker, setShowPicker] = useState(true);

    return (
      <div style={{ width: '402px', margin: '0 auto' }}>
        {showPicker && (
          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date);
              console.log('선택된 날짜:', date);
            }}
            onClose={() => {
              setShowPicker(false);
              setTimeout(() => setShowPicker(true), 1000);
            }}
          />
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '오늘 날짜가 선택된 상태의 달력입니다. 선택된 날짜는 파란색으로 하이라이트되고, 오늘 날짜에는 파란색 테두리가 표시됩니다.',
      },
    },
  },
};

// 일반 가격 제안용 날짜 제한
export const ForStandardPricing: Story = {
  name: '일반 가격 제안용',
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(true);
    
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1); // 1년 후까지

    return (
      <div style={{ width: '402px', margin: '0 auto' }}>
        {showPicker && (
          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date);
              console.log('선택된 날짜:', date);
              console.log('API 요청 날짜 (1년 전):', (() => {
                const apiDate = new Date(date);
                apiDate.setFullYear(date.getFullYear() - 1);
                return apiDate.toISOString().split('T')[0];
              })());
            }}
            onClose={() => {
              setShowPicker(false);
              setTimeout(() => setShowPicker(true), 1000);
            }}
            minDate={today}
            maxDate={maxDate}
          />
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '일반 가격 제안용 달력입니다. 오늘부터 1년 후까지만 선택 가능하며, 실제 API 요청 시에는 선택된 날짜의 1년 전 데이터를 조회합니다.',
      },
    },
  },
};

// 프리미엄 가격 제안용 날짜 제한 (3일 후부터)
export const ForPremiumPricing: Story = {
  name: '프리미엄 가격 제안용',
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(true);
    
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3); // 오늘부터 3일 후
    
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1); // 1년 후까지

    return (
      <div style={{ width: '402px', margin: '0 auto' }}>
        {showPicker && (
          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date);
              console.log('선택된 날짜:', date);
              
              // 프리미엄 가격 제안 API 요청 날짜 범위 계산 (백엔드에서 처리)
              const selectedYear = date.getFullYear();
              const lastYear = selectedYear - 1;
              
              // 백엔드로 사용자 선택 날짜 그대로 전송
              const userSelectedDate = date.toISOString().split('T')[0];
              
              // 백엔드에서 실제로 조회할 날짜 범위 (설명용)
              const centerDate = new Date(date);
              centerDate.setFullYear(lastYear); // 작년 동일 날짜
              
              const startDate = new Date(centerDate);
              startDate.setDate(startDate.getDate() - 2); // 중심 - 2일
              
              const endDate = new Date(centerDate);
              endDate.setDate(endDate.getDate() + 2); // 중심 + 2일
              
              console.log('프리미엄 가격 제안 날짜 처리:', {
                userSelected: userSelectedDate,
                backendCenter: centerDate.toISOString().split('T')[0],
                backendStart: startDate.toISOString().split('T')[0],
                backendEnd: endDate.toISOString().split('T')[0],
                description: `사용자 선택: ${date.getMonth() + 1}월 ${date.getDate()}일 → 백엔드 조회: ${lastYear}년 ${date.getMonth() + 1}월 ${date.getDate() - 2}~${date.getDate() + 2}일`
              });
            }}
            onClose={() => {
              setShowPicker(false);
              setTimeout(() => setShowPicker(true), 1000);
            }}
            minDate={minDate}
            maxDate={maxDate}
          />
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '프리미엄 가격 제안용 달력입니다. 오늘부터 3일 후부터 1년 후까지 선택 가능하며, 실제 API 요청 시에는 선택된 날짜의 1년 전 중간 기준으로 앞뒤 5일간의 데이터를 조회합니다.',
      },
    },
  },
};

export const ModernDesign: Story = {
  name: '모던한 디자인 특징',
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [showPicker, setShowPicker] = useState(true);

    return (
      <div style={{ width: '402px', margin: '0 auto' }}>
        {showPicker && (
          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date);
              console.log('선택된 날짜:', date);
            }}
            onClose={() => {
              setShowPicker(false);
              setTimeout(() => setShowPicker(true), 1000);
            }}
          />
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '모던한 디자인 특징들: 그라데이션 헤더, 백드롭 블러, 슬라이드업 애니메이션, 호버 효과, 바운스 애니메이션, 일요일/토요일 색상 구분',
      },
    },
  },
};

export const InteractiveFeatures: Story = {
  name: '인터랙티브 기능',
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(true);

    return (
      <div style={{ width: '402px', margin: '0 auto' }}>
        {showPicker && (
          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date);
              console.log('선택된 날짜:', date);
            }}
            onClose={() => {
              setShowPicker(false);
              setTimeout(() => setShowPicker(true), 1000);
            }}
          />
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '인터랙티브 기능들: 월 이동 버튼 호버 효과, 날짜 셀 호버 시 확대, 클릭 시 바운스 애니메이션, ESC 키로 닫기, 오버레이 클릭으로 닫기',
      },
    },
  },
}; 