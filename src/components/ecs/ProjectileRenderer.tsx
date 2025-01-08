import React from 'react';
import { Circle } from 'react-konva';
import { RenderData } from '../../game/ecs/systems/RenderSystem';

interface ProjectileRendererProps {
  projectileData: RenderData;
}

/**
 * ProjectileRenderer - Renders a projectile entity using Konva
 */
const ProjectileRenderer: React.FC<ProjectileRendererProps> = ({ projectileData }) => {
  const { x, y, width, height } = projectileData;
  
  // Calculate center coordinates
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  return (
    // Simple circle with glow effect
    <Circle
      x={centerX}
      y={centerY}
      radius={width / 2}
      fill="#f7c33b"
      shadowColor="#f7c33b"
      shadowBlur={10}
      shadowOpacity={0.8}
      className="projectile-glow"
    />
  );
};

export default ProjectileRenderer; 