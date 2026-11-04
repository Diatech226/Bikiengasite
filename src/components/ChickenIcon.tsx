import React from 'react';

interface ChickenIconProps {
  className?: string;
  size?: number;
  filled?: boolean;
}

/**
 * Tête de poussin simplifiée (simplified chick head) matching Google Material Symbols style.
 * Bold, high-contrast silhouette that stays crisp and instantly recognizable at small sizes (19px/24px),
 * matching the visual weight of the agriculture 'eco' icon.
 */
export const ChickenIcon: React.FC<ChickenIconProps> = ({
  className = 'w-[19px] h-[19px]',
  size,
  filled = false,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? 0 : 1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {filled ? (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.5 5.5C10 3 11.5 2 12.5 3.5C13.5 2 15 2.5 14.5 5.5C17 7 17.5 9 17.2 11L21.5 13.5L17 15.5C16.5 18.5 14.5 20.5 11.5 20.5C7.5 20.5 4.5 17.4 4.5 13C4.5 9 7 5.8 10.5 5.5ZM13 10A1.3 1.3 0 1 0 13 12.6A1.3 1.3 0 1 0 13 10Z"
        />
      ) : (
        <>
          <path d="M10.5 5.5C10 3 11.5 2 12.5 3.5C13.5 2 15 2.5 14.5 5.5C17 7 17.5 9 17.2 11L21.5 13.5L17 15.5C16.5 18.5 14.5 20.5 11.5 20.5C7.5 20.5 4.5 17.4 4.5 13C4.5 9 7 5.8 10.5 5.5Z" />
          <circle cx="13" cy="11.3" r="1.3" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
};
