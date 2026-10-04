import React from 'react';

interface RasheedLogoProps {
  size?: number;
}

export const RasheedLogo: React.FC<RasheedLogoProps> = ({ size = 44 }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-xl bg-[#004845] flex flex-col items-center justify-center p-1 shadow-sm flex-shrink-0 select-none"
    >
      {/* Graduation Cap */}
      <svg
        className="w-5 h-5 text-amber-300"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 19.39 8.13 21 12 21C15.87 21 19 19.39 19 17.18V13.18L12 17L5 13.18Z" />
      </svg>
      {/* "الرشيد" Arabic Text */}
      <span className="text-[9px] font-black text-amber-300 leading-none mt-0.5 tracking-tight font-['Cairo',sans-serif]">
        الرشيد
      </span>
    </div>
  );
};

export const AssistantAvatar: React.FC<{ size?: number }> = ({ size = 38 }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-xl bg-[#004845] flex items-center justify-center text-amber-300 shadow-sm flex-shrink-0"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 19.39 8.13 21 12 21C15.87 21 19 19.39 19 17.18V13.18L12 17L5 13.18Z" />
      </svg>
    </div>
  );
};

export const UserAvatar: React.FC<{ size?: number }> = ({ size = 38 }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-[#006967] flex items-center justify-center text-white shadow-sm flex-shrink-0"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
};
