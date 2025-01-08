import React from 'react';
import { Layer, Rect, Stage, Text } from 'react-konva';
import { GAME_HEIGHT, GAME_WIDTH } from '../../game/constants';

/**
 * LoadingScreen component - Displays while the ECS is initializing
 */
const LoadingScreen: React.FC = () => {
  return (
    <Stage width={GAME_WIDTH} height={GAME_HEIGHT}>
      <Layer>
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          fill="#000"
          opacity={0.8}
        />
        
        {/* Loading message */}
        <Text
          x={GAME_WIDTH / 2}
          y={GAME_HEIGHT / 2}
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
          x={GAME_WIDTH / 2}
          y={GAME_HEIGHT / 2 + 40}
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