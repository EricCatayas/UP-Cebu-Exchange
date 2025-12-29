'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ModalContent {
  title: string;
  message: string;
}

export interface ModalState {
  isOpen: boolean;
  content: ModalContent | null;
  confirmation: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalContextType {
  modal: ModalState;
  openModal: (content: ModalContent) => void;
  openConfirmation: (content: ModalContent, onConfirm: () => void, onCancel?: () => void) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    content: null,
    confirmation: false,
  });

  const openModal = useCallback((content: ModalContent) => {
    setModal({
      isOpen: true,
      content,
      confirmation: false,
    });
  }, []);

  const openConfirmation = useCallback((content: ModalContent, onConfirm: () => void, onCancel?: () => void) => {
    setModal({
      isOpen: true,
      content,
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
