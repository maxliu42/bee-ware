import React, { useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import { useImage } from 'react-konva-utils';
import { STAGE_WIDTH, STAGE_HEIGHT } from '../game/constants';
import { useECS } from '../game/ecs/hooks/useECS';
import EntityRenderer from './ecs/EntityRenderer';
import LoadingScreen from './ecs/LoadingScreen';
import Score from './ui/Score';
import GameOver from './ui/GameOver';
import LevelUp from './ui/LevelUp';

// Import background image
import bgImage from '../assets/images/bg.png';

/**
 * ECS-based Game component
 */
const ECSGame: React.FC = () => {
  // Load assets
  const [bgLoaded] = useImage(bgImage);
  
  // Game state
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // Sample upgrades (in a full implementation, we would generate these dynamically)
  const upgrades = [
    {
      id: 'speed',
      name: 'Speed Boost',
      description: 'Increase movement speed',
      apply: () => console.log('Speed upgraded')
    },
    {
      id: 'attack',
      name: 'Attack Speed',
      description: 'Increase attack rate',
      apply: () => console.log('Attack speed upgraded')
    },
    {
      id: 'damage',
      name: 'Damage Boost',
      description: 'Increase projectile damage',
      apply: () => console.log('Damage upgraded')
    }
  ];
  
  // Initialize ECS
  const { renderData, score, isInitialized } = useECS(isPaused || isGameOver);
  
  // Handle upgrade selection
  const handleSelectUpgrade = (upgrade: any) => {
    upgrade.apply();
    setShowLevelUp(false);
    setIsPaused(false);
  };
  
  // Show loading screen if ECS is not initialized
  if (!isInitialized) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="game-container">
      <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
        <Layer>
          {/* Background image */}
          {bgLoaded && (
            <KonvaImage
              image={bgLoaded}
              width={STAGE_WIDTH}
              height={STAGE_HEIGHT}
            />
          )}
          
          {/* Render ECS entities */}
          <EntityRenderer renderData={renderData} />
          
          {/* UI Elements */}
          <Score score={score} />
          <GameOver visible={isGameOver} />
          <LevelUp 
            visible={showLevelUp} 
            upgrades={upgrades} 
            onSelect={handleSelectUpgrade} 
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default ECSGame; 