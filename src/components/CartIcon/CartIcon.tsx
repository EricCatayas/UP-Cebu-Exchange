import React from 'react';

interface CartIconProps {
  filled?: boolean;
  size?: number;
  className?: string;
}

export default function CartIcon({ filled = false, size = 24, className = '' }: CartIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'red' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path d="M7 4h-2l-1 2v2h2l3.6 7.59-1.35 2.41A2 2 0 0 0 10 20h10v-2H10l1.1-2h7.45a2 2 0 0 0 1.79-1.11L22 9H6.21l-.94-2H7V4Zm3 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm8 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" />
    </svg>
  );
}
