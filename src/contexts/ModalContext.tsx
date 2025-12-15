'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ModalState {
  isOpen: boolean;
  message: string;
  confirmation: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalContextType {
  modal: ModalState;
  openModal: (message: string) => void;
  openConfirmation: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    message: '',
    confirmation: false,
  });

  const openModal = useCallback((message: string) => {
    setModal({
      isOpen: true,
      message,
      confirmation: false,
    });
  }, []);

  const openConfirmation = useCallback((message: string, onConfirm: () => void, onCancel?: () => void) => {
    setModal({
      isOpen: true,
      message,
      confirmation: true,
      onConfirm,
      onCancel,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  return (
    <ModalContext.Provider value={{ modal, openModal, openConfirmation, closeModal }}>{children}</ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}
