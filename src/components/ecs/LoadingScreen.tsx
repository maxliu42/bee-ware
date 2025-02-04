import React from 'react';
import { Layer, Rect, Stage, Text } from 'react-konva';
import { STAGE_WIDTH, STAGE_HEIGHT } from '../../game/constants';

/**
 * LoadingScreen component - Displays while the ECS is initializing
 */
const LoadingScreen: React.FC = () => {
  return (
    <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
      <Layer>
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          fill="#000"
          opacity={0.8}
        />
        
        {/* Loading message */}
        <Text
          x={STAGE_WIDTH / 2}
          y={STAGE_HEIGHT / 2}
          text="Loading Bee-Ware ECS Edition..."
          fontSize={24}
          fontFamily="Arial"
          fill="#fff"
          align="center"
          verticalAlign="middle"
          offset={{ x: 150, y: 12 }}
        />
        
        {/* Loading hint */}
        <Text
          x={STAGE_WIDTH / 2}
          y={STAGE_HEIGHT / 2 + 40}
          text="The bees are getting organized..."
          fontSize={16}
          fontFamily="Arial"
          fill="#ffcc00"
          align="center"
          verticalAlign="middle"
          offset={{ x: 120, y: 8 }}
        />
      </Layer>
    </Stage>
  );
};

export default LoadingScreen; 