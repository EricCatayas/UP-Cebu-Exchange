'use client';

import React from 'react';
import { useModal } from '@/contexts/ModalContext';
import './Modal.css';

export function Modal() {
  const { modal, closeModal } = useModal();

  if (!modal.isOpen) return null;

  const handleConfirm = () => {
    modal.onConfirm?.();
    closeModal();
  };

  const handleCancel = () => {
    modal.onCancel?.();
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-message">{modal.message}</p>
        <div className="modal-actions">
          {modal.confirmation ? (
            <>
              <button className="modal-btn modal-btn-confirm" onClick={handleConfirm}>
                Yes
              </button>
              <button className="modal-btn modal-btn-cancel" onClick={handleCancel}>
                No
              </button>
            </>
          ) : (
            <button className="modal-btn modal-btn-confirm" onClick={closeModal}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
