'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/contexts/ModalContext';
import { artworkApi } from '@/lib/api/artwork';
import { FaTrash } from 'react-icons/fa';

export function DeleteArtworkButton({ artworkId }) {
  const { openConfirmation } = useModal();
  const router = useRouter();

  const handleDelete = async (artworkId: number) => {
    openConfirmation(
      {
        title: 'Delete Artwork',
        message: 'Are you sure you want to delete this artwork?',
      },
      async () => {
        try {
          await artworkApi.delete(artworkId);
          alert('Artwork deleted successfully.');
          router.push('/admin/inventory');
        } catch (error) {
          alert(error.message);
        }
      },
      () => {}
    );
  };

  return (
    <button
      onClick={() => handleDelete(artworkId)}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      <FaTrash /> Delete
    </button>
  );
}
