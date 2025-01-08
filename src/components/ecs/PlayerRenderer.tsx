import React from 'react';
import { Group, Circle, Line } from 'react-konva';
import { RenderData } from '../../game/ecs/systems/RenderSystem';
import HealthBar from '../ui/HealthBar';

interface PlayerRendererProps {
  playerData: RenderData;
}

/**
 * PlayerRenderer - Renders a player entity using Konva
 */
const PlayerRenderer: React.FC<PlayerRendererProps> = ({ playerData }) => {
  const { x, y, width, height, health } = playerData;
  
  // Calculate center coordinates
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  // Generate line points helper function
  const generateRelativeLine = (
    centerX: number, 
    centerY: number,
    relStartX: number, 
    relStartY: number,
    relEndX: number, 
    relEndY: number
  ): number[] => {
    return [
      centerX + relStartX,
      centerY + relStartY,
      centerX + relEndX,
      centerY + relEndY
    ];
  };
  
  return (
    <Group>
      {/* Bee wings */}
      <Circle
        x={centerX - width/3}
        y={centerY - height/3}
        radius={width/3}
        fill="rgba(255, 255, 255, 0.7)"
        stroke="rgba(255, 255, 255, 0.8)"
        opacity={0.7}
      />
      <Circle
        x={centerX + width/3}
        y={centerY - height/3}
        radius={width/3}
        fill="rgba(255, 255, 255, 0.7)"
        stroke="rgba(255, 255, 255, 0.8)"
        opacity={0.7}
      />
      
      {/* Bee body */}
      <Circle
        x={centerX}
        y={centerY}
        radius={width / 2}
        fill="#f7c33b"
        stroke="#000000"
        strokeWidth={2}
      />
      
      {/* Bee stripes */}
      <Line
        points={generateRelativeLine(
          centerX, centerY,
          -width/2, -height/5,
          width/2, -height/5
        )}
        stroke="#000000"
        strokeWidth={4}
      />
      <Line
        points={generateRelativeLine(
          centerX, centerY,
          -width/2, height/8,
          width/2, height/8
        )}
        stroke="#000000"
        strokeWidth={4}
      />
      
      {/* Bee face (eyes) */}
      <Circle
        x={centerX - width/6}
        y={centerY - height/8}
        radius={width/10}
        fill="#000000"
      />
      <Circle
        x={centerX + width/6}
        y={centerY - height/8}
        radius={width/10}
        fill="#000000"
      />
      
      {/* Stinger */}
      <Line
        points={generateRelativeLine(
          centerX, centerY,
          0, height/2,
          0, height/1.3
        )}
        stroke="#000000"
        strokeWidth={2}
        lineCap="round"
      />
      
      {/* Health bar */}
      {health && (
        <HealthBar
          x={x}
          y={y - 10}
          width={width}
          currentHealth={health.current}
          maxHealth={health.max}
          barColor="#4CAF50"
        />
      )}
    </Group>
  );
};

export default PlayerRenderer; 