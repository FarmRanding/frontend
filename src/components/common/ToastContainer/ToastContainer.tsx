import React from 'react';
import styled from 'styled-components';
import { Toast, type ToastProps } from '../Toast';

export interface ToastContainerProps {
  toasts: ToastProps[];
  onCloseToast: (id: string) => void;
}

const Container = styled.div`
  position: fixed;
  top: 80px;
  right: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  max-width: 100vw;
  pointer-events: none;

  @media (max-width: 402px) {
    top: 70px;
    right: 0;
    left: 0;
    align-items: center;
  }

  > * {
    pointer-events: auto;
  }
`;

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onCloseToast
}) => {
  if (toasts.length === 0) return null;

  return (
    <Container>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onCloseToast}
        />
      ))}
    </Container>
  );
}; 