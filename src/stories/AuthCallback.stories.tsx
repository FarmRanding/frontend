import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import AuthCallback from '../pages/AuthCallback/AuthCallback';

const meta = {
  title: 'Pages/AuthCallback',
  component: AuthCallback,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </AuthProvider>
    ),
  ],
} satisfies Meta<typeof AuthCallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본 인증 콜백',
  parameters: {
    docs: {
      description: {
        story: 'OAuth2 로그인 성공 후 토큰을 처리하는 페이지입니다.',
      },
    },
  },
};

export const Loading: Story = {
  name: '로딩 상태',
  parameters: {
    docs: {
      description: {
        story: '토큰 처리 중인 로딩 상태를 보여줍니다.',
      },
    },
  },
}; 