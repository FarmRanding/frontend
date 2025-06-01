import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { createContext, useContext } from 'react';
import ProtectedRoute from '../components/common/ProtectedRoute/ProtectedRoute';

// Mock AuthContext for Storybook
interface MockAuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (userInfo: any) => void;
  logout: () => void;
  loading: boolean;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

const MockAuthProvider = ({ children, isAuthenticated = false, loading = false }: any) => {
  const value = {
    isAuthenticated,
    user: isAuthenticated ? { userId: '1', email: 'test@example.com', nickname: '테스트유저' } : null,
    login: () => {},
    logout: () => {},
    loading,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
};

// Mock useAuth hook
const useAuth = () => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Override the real useAuth for Storybook
(ProtectedRoute as any).__useAuth = useAuth;

const meta = {
  title: 'Components/ProtectedRoute',
  component: ProtectedRoute,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story, { args }) => (
      <MockAuthProvider {...args}>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </MockAuthProvider>
    ),
  ],
} satisfies Meta<typeof ProtectedRoute>;

export default meta;
type Story = StoryObj<typeof meta>;

const TestContent = () => (
  <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
    <h1>보호된 페이지 콘텐츠</h1>
    <p>인증된 사용자만 볼 수 있는 내용입니다.</p>
  </div>
);

export const Authenticated: Story = {
  name: '인증된 사용자',
  args: {
    isAuthenticated: true,
    loading: false,
    children: <TestContent />,
  },
  parameters: {
    docs: {
      description: {
        story: '인증된 사용자가 보호된 라우트에 접근할 때의 상태입니다.',
      },
    },
  },
};

export const Unauthenticated: Story = {
  name: '미인증 사용자',
  args: {
    isAuthenticated: false,
    loading: false,
    children: <TestContent />,
  },
  parameters: {
    docs: {
      description: {
        story: '미인증 사용자가 보호된 라우트에 접근할 때 홈으로 리다이렉트됩니다.',
      },
    },
  },
};

export const Loading: Story = {
  name: '로딩 상태',
  args: {
    isAuthenticated: false,
    loading: true,
    children: <TestContent />,
  },
  parameters: {
    docs: {
      description: {
        story: '인증 상태를 확인하는 동안 보여지는 로딩 화면입니다.',
      },
    },
  },
}; 