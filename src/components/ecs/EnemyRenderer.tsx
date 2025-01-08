import React from 'react';
import { Group, Circle, Line } from 'react-konva';
import { RenderData } from '../../game/ecs/systems/RenderSystem';
import HealthBar from '../ui/HealthBar';

interface EnemyRendererProps {
  enemyData: RenderData;
}

/**
 * EnemyRenderer - Renders an enemy entity using Konva
 */
const EnemyRenderer: React.FC<EnemyRendererProps> = ({ enemyData }) => {
  const { x, y, width, height, health } = enemyData;
  
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
      {/* Wasp wings */}
      <Circle
        x={centerX - width/3}
        y={centerY - height/4}
        radius={width/4}
        fill="rgba(255, 255, 255, 0.5)"
        opacity={0.7}
      />
      <Circle
        x={centerX + width/3}
        y={centerY - height/4}
        radius={width/4}
        fill="rgba(255, 255, 255, 0.5)"
        opacity={0.7}
      />
      
      {/* Wasp body */}
      <Circle
        x={centerX}
        y={centerY}
        radius={width / 2}
        fill="#d32f2f" // Flat red color
        stroke="#000000"
        strokeWidth={2}
      />
      
      {/* Wasp stripes */}
      <Line
        points={generateRelativeLine(
          centerX, centerY,
          -width/2, -height/6,
          width/2, -height/6
        )}
        stroke="#000000"
        strokeWidth={3}
      />
      <Line
        points={generateRelativeLine(
          centerX, centerY,
          -width/2, height/8,
          width/2, height/8
        )}
        stroke="#000000"
        strokeWidth={3}
      />
      <Line
        points={generateRelativeLine(
          centerX, centerY,
          -width/2, height/3,
          width/2, height/3
        )}
        stroke="#000000"
        strokeWidth={3}
      />
      
      {/* Wasp face (eyes) */}
      <Circle
        x={centerX - width/6}
        y={centerY - height/8}
        radius={width/10}
        fill="#ffff00"
      />
      <Circle
        x={centerX + width/6}
        y={centerY - height/8}
        radius={width/10}
        fill="#ffff00"
      />
      
      {/* Stinger */}
      <Line
        points={generateRelativeLine(
          centerX, centerY,
          0, height/2,
          0, height/1.2
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
          barColor="#f44336"
        />
      )}
    </Group>
  );
};

export default EnemyRenderer; 