import React from 'react';

interface NoiseOverlayProps {
  variant?: 1 | 2;
}

const NoiseOverlay: React.FC<NoiseOverlayProps> = ({ variant = 1 }) => {
  const className = variant === 1 ? 'noise-overlay' : 'noise-overlay-2';
  
  return (
    <div className={className} />
  );
};

export default NoiseOverlay; 