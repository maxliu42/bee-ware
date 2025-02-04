import React from 'react';

interface OrbProps {
  left: string;
  top: string;
  width: string;
  height: string;
  animation: string;
  animationDelay: string;
  color: string;
}

const Orb: React.FC<OrbProps> = ({
  left,
  top,
  width,
  height,
  animation,
  animationDelay,
  color
}) => {
  // Use CSS custom properties for dynamic values
  const style = {
    '--left': left,
    '--top': top,
    '--width': width,
    '--height': height,
    '--animation': animation,
    '--animation-delay': animationDelay,
    '--color': color,
    '--pulse-delay': `${parseInt(animationDelay)}s`
  } as React.CSSProperties;

  return <div className="orb" style={style} />;
};

export default Orb; 