import React from 'react';

interface TapIconProps {
  tapped: boolean;
  className?: string;
}

export function TapIcon({ tapped, className = '' }: TapIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      className={`inline-block ${className} ${tapped ? 'rotate-90' : ''} transition-transform`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L8 6l4 4-4 4 4 4-4 4" />
    </svg>
  );
}