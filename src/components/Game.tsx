import React, { useState, useEffect, useCallback, memo } from 'react';
import { Stage, Layer, Image as KonvaImage, Text } from 'react-konva';
import { useImage } from 'react-konva-utils';
import { STAGE_WIDTH, STAGE_HEIGHT } from '../game/constants';
import { useECS } from '../game/ecs/hooks/useECS';
import { GameStateSystem } from '../game/ecs/systems/GameStateSystem';
import EntityRenderer from './ecs/EntityRenderer';
import LoadingScreen from './ecs/LoadingScreen';
import Score from './ui/Score';
import GameOver from './ui/GameOver';
import LevelUp from './ui/LevelUp';

// Import background image
import bgImage from '../assets/images/bg.png';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  apply: () => void;
}

// Memoized background image to prevent re-rendering
const Background = memo(({ image }: { image: HTMLImageElement }) => (
  <KonvaImage
    image={image}
    width={STAGE_WIDTH}
    height={STAGE_HEIGHT}
  />
));

// Memoized debug info to prevent re-rendering
const DebugInfo = memo(({ entityCount, fps }: { entityCount: Record<string, number>, fps: number }) => (
  <>
    <Text
      text={`FPS: ${fps}`}
      x={10}
      y={10}
      fontSize={14}
      fill="white"
    />
    <Text
      text={`Entities: Total: ${entityCount.total} | Players: ${entityCount.players} | Enemies: ${entityCount.enemies} | Projectiles: ${entityCount.projectiles}`}
      x={10}
      y={30}
      fontSize={14}
      fill="white"
    />
  </>
));

/**
 * ECS-based Game component
 */
const Game: React.FC = () => {
  // Load assets
  const [bgLoaded] = useImage(bgImage);
  
  // Game state
  const [isPaused, setIsPaused] = useState(false);
  // Debug state - only update occasionally to reduce re-renders
  const [entityCount, setEntityCount] = useState<Record<string, number>>({
    total: 0,
    players: 0,
    enemies: 0,
    projectiles: 0,
  });
  
  // Whether to show performance metrics (FPS, entity count)
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(true);
  
  // Track the last time we updated the entity count
  const lastDebugUpdateRef = React.useRef<number>(0);
  
  // Sample upgrades
  const upgrades: Upgrade[] = [
    {
      id: 'speed',
      name: 'Speed Boost',
      description: 'Increase movement speed',
      apply: () => {} // Will be implemented with actual functionality
    },
    {
      id: 'attack',
      name: 'Attack Speed',
      description: 'Increase attack rate',
      apply: () => {} // Will be implemented with actual functionality
    },
    {
      id: 'damage',
      name: 'Damage Boost',
      description: 'Increase projectile damage',
      apply: () => {} // Will be implemented with actual functionality
    }
  ];
  
  // Initialize ECS
  const {
    categorizedRenderData,
    score,
    isGameOver,
    showLevelUp,
    isInitialized,
    world,
    fps
  } = useECS(isPaused);
  
  // Toggle performance metrics on pressing F key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        setShowPerformanceMetrics(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Memoized function to update entity counts for debugging - throttled to reduce performance impact
  const updateEntityCount = useCallback(() => {
    if (world && isInitialized) {
      const currentTime = performance.now();
      
      // Only update debug info every 500ms to reduce performance impact
      if (currentTime - lastDebugUpdateRef.current > 500) {
        const entityManager = world.getEntityManager();
        setEntityCount({
          total: entityManager.getEntityCount(),
          players: categorizedRenderData.players.length,
          enemies: categorizedRenderData.enemies.length,
          projectiles: categorizedRenderData.projectiles.length,
        });
        
        lastDebugUpdateRef.current = currentTime;
      }
    }
  }, [world, isInitialized, categorizedRenderData]);
  
  // Update entity counts for debugging - less frequently
  useEffect(() => {
    if (showPerformanceMetrics) {
      updateEntityCount();
    }
  }, [updateEntityCount, showPerformanceMetrics]);
  
  // Update pause state based on level up
  useEffect(() => {
    if (showLevelUp) {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  }, [showLevelUp]);
  
  // Handle upgrade selection
  const handleSelectUpgrade = useCallback((upgrade: Upgrade) => {
    upgrade.apply();
    
    // Update game state through the system
    if (world) {
      const gameStateSystem = world.getSystem(GameStateSystem);
      if (gameStateSystem) {
        gameStateSystem.setShowLevelUp(false);
      }
    }
  }, [world]);
  
  // Show loading screen if ECS is not initialized
  if (!isInitialized) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="game-container">
      <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT}>
        <Layer>
          {/* Background image */}
          {bgLoaded && <Background image={bgLoaded} />}
          
          {/* Performance metrics - toggle with F key */}
          {showPerformanceMetrics && <DebugInfo entityCount={entityCount} fps={fps} />}
          
          {/* Render ECS entities */}
          <EntityRenderer renderData={categorizedRenderData} />
          
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

export default Game; 