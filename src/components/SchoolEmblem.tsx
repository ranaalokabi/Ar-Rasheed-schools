import React from 'react';

interface SchoolEmblemProps {
  size?: number;
  className?: string;
}

export const SchoolEmblem: React.FC<SchoolEmblemProps> = ({
  size = 48,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center flex-shrink-0 select-none ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xs"
      >
        {/* Layer 1 (Topmost): Cyan / Soft Turquoise Soaring Bird */}
        <path
          d="M40 18C48 13 56 18 60 21C64 18 72 13 80 18C74 20 66 21 60 27C54 21 46 20 40 18Z"
          fill="#52b7aa"
        />

        {/* Layer 2: Warm Golden Yellow Upward Book Page / Chevrons */}
        <path
          d="M32 28C44 24 54 30 60 34C66 30 76 24 88 28C78 30 68 32 60 40C52 32 42 30 32 28Z"
          fill="#fbc02d"
        />

        {/* Layer 3: Purple / Magenta Upward Book Page Layer */}
        <path
          d="M24 39C40 34 52 42 60 47C68 42 80 34 96 39C84 42 72 45 60 55C48 45 36 42 24 39Z"
          fill="#a85094"
        />

        {/* Layer 4: Main Turquoise Book / Stylized Fountain Pen Nib */}
        {/* Left Book Page / Left Nib Wing */}
        <path
          d="M24 49C40 46 54 54 59.5 62V97C56 94 40 85 24 78V49Z"
          fill="#00bfa5"
        />
        {/* Right Book Page / Right Nib Wing */}
        <path
          d="M96 49C80 46 66 54 60.5 62V97C64 94 80 85 96 78V49Z"
          fill="#00a896"
        />

        {/* Nib Lower Pointed Stem & Tip */}
        <path
          d="M59.5 97L60 108L60.5 97H59.5Z"
          fill="#00897b"
        />
        {/* Nib Tip Circle */}
        <circle cx="60" cy="109" r="2.2" fill="#00897b" />

        {/* Center Vertical Pen Slit (White Cutout) */}
        <line
          x1="60"
          y1="62"
          x2="60"
          y2="104"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Central Fountain Pen Breather Hole (White Circle) */}
        <circle cx="60" cy="83" r="3.6" fill="#ffffff" />
      </svg>
    </div>
  );
};
