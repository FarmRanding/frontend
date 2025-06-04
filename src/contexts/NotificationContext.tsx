import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ToastContainer } from '../components/common/ToastContainer';
import { Dialog, type DialogType } from '../components/common/Dialog';
import { SelectModal, type SelectOption } from '../components/common/SelectModal';
import { ToastType, ToastProps } from '../components/common/Toast';

interface ToastInput {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface DialogInput {
  type: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface SelectInput {
  title: string;
  options: SelectOption[];
  selectedValue?: string;
}

interface NotificationContextType {
  // Toast 메서드
  showToast: (toast: ToastInput) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  
  // Dialog 메서드
  showAlert: (input: DialogInput) => Promise<void>;
  showConfirm: (input: DialogInput) => Promise<boolean>;
  
  // Select 메서드
  showSelect: (input: SelectInput) => Promise<string | null>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [dialog, setDialog] = useState<{
    isVisible: boolean;
    type: DialogType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    resolve?: (value: boolean) => void;
  }>({
    isVisible: false,
    type: 'alert',
    title: '',
    message: ''
  });
  
  const [selectModal, setSelectModal] = useState<{
    isVisible: boolean;
    title: string;
    options: SelectOption[];
    selectedValue?: string;
    onSelect?: (value: string) => void;
    onCancel?: () => void;
  }>({
    isVisible: false,
    title: '',
    options: []
  });

  // Toast 관련 메서드
  const showToast = (toast: ToastInput) => {
    const id = Date.now().toString();
    const newToast: ToastProps = {
      id,
      ...toast,
      onClose: (toastId: string) => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // duration 후 자동 제거
    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, toast.duration || 4000);
    }
  };

  const showSuccess = (title: string, message?: string, duration?: number) => {
    showToast({ type: 'success', title, message, duration });
  };

  const showError = (title: string, message?: string, duration?: number) => {
    showToast({ type: 'error', title, message, duration });
  };

  const showInfo = (title: string, message?: string, duration?: number) => {
    showToast({ type: 'info', title, message, duration });
  };

  const showWarning = (title: string, message?: string, duration?: number) => {
    showToast({ type: 'warning', title, message, duration });
  };

  // Dialog 관련 메서드
  const showAlert = (input: DialogInput): Promise<void> => {
    return new Promise((resolve) => {
      setDialog({
        isVisible: true,
        type: 'alert',
        title: input.title,
        message: input.message,
        confirmText: input.confirmText,
        resolve: () => {
          setDialog(prev => ({ ...prev, isVisible: false }));
          resolve();
        }
      });
    });
  };

  const showConfirm = (input: DialogInput): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        isVisible: true,
        type: 'confirm',
        title: input.title,
        message: input.message,
        confirmText: input.confirmText,
        cancelText: input.cancelText,
        resolve: (result: boolean) => {
          setDialog(prev => ({ ...prev, isVisible: false }));
          resolve(result);
        }
      });
    });
  };

  // Select 관련 메서드
  const showSelect = (input: SelectInput): Promise<string | null> => {
    return new Promise((resolve) => {
      setSelectModal({
        isVisible: true,
        title: input.title,
        options: input.options,
        selectedValue: input.selectedValue,
        onSelect: (value: string) => {
          setSelectModal(prev => ({ ...prev, isVisible: false }));
          resolve(value);
        },
        onCancel: () => {
          setSelectModal(prev => ({ ...prev, isVisible: false }));
          resolve(null);
        }
      });
    });
  };

  // Dialog 핸들러
  const handleDialogConfirm = () => {
    if (dialog.resolve) {
      dialog.resolve(true);
    }
  };

  const handleDialogCancel = () => {
    if (dialog.resolve) {
      dialog.resolve(false);
    }
  };

  const contextValue: NotificationContextType = {
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showAlert,
    showConfirm,
    showSelect
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onCloseToast={(id: string) => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }}
      />
      
      {/* Dialog */}
      {dialog.isVisible && (
        <Dialog
          type={dialog.type!}
          title={dialog.title!}
          message={dialog.message!}
          confirmText={dialog.confirmText}
          cancelText={dialog.cancelText}
          onConfirm={handleDialogConfirm}
          onCancel={dialog.type === 'confirm' ? handleDialogCancel : undefined}
          isVisible={dialog.isVisible}
        />
      )}
      
      {/* Select Modal */}
      {selectModal.isVisible && (
        <SelectModal
          title={selectModal.title!}
          options={selectModal.options!}
          selectedValue={selectModal.selectedValue}
          onSelect={selectModal.onSelect!}
          onCancel={selectModal.onCancel!}
          isVisible={selectModal.isVisible}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 