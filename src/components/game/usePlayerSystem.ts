import { useState, useEffect, useRef, useCallback } from 'react';
import { Position } from '../../types/types';
import { 
  PLAYER_SPEED, 
  PLAYER_SIZE, 
  PLAYER_INITIAL_HEALTH,
  PLAYER_X,
  PLAYER_Y,
  PLAYER_SPEED_UPGRADE
} from '../../game/constants';
import { clamp } from '../../utils/mathUtils';
import { keepInBounds } from './gameUtils';

/**
 * Custom hook for managing player position and health
 */
export const usePlayerSystem = (keys: { [key: string]: boolean }) => {
  // Player position and health state
  const [playerPos, setPlayerPos] = useState<Position>({
    x: PLAYER_X,
    y: PLAYER_Y
  });
  const [playerHealth, setPlayerHealth] = useState(PLAYER_INITIAL_HEALTH);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(PLAYER_SPEED);
  
  const playerPosRef = useRef(playerPos);
  
  // Update ref when position changes
  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);
  
  // Check for game over when health changes
  useEffect(() => {
    if (playerHealth <= 0 && !isGameOver) {
      setIsGameOver(true);
    }
  }, [playerHealth, isGameOver]);
  
  // Update player position based on pressed keys
  const updatePosition = useCallback(() => {
    if (isGameOver) return; // Don't update position if game is over
    
    setPlayerPos(prevPos => {
      let deltaX = 0;
      let deltaY = 0;

      // Calculate movement direction first
      if (keys['w'] || keys['arrowup']) {
        deltaY = -1;
      }
      if (keys['s'] || keys['arrowdown']) {
        deltaY = 1;
      }
      if (keys['a'] || keys['arrowleft']) {
        deltaX = -1;
      }
      if (keys['d'] || keys['arrowright']) {
        deltaX = 1;
      }

      // Normalize diagonal movement to maintain consistent speed
      if (deltaX !== 0 && deltaY !== 0) {
        // If moving diagonally, normalize the vector
        const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        deltaX = deltaX / length;
        deltaY = deltaY / length;
      }

      // Apply speed after normalization
      const newX = prevPos.x + deltaX * currentSpeed;
      const newY = prevPos.y + deltaY * currentSpeed;

      // Use utility function to keep player in bounds
      return keepInBounds({ x: newX, y: newY }, PLAYER_SIZE);
    });
  }, [keys, isGameOver, currentSpeed]);
  
  // Function to damage the player
  const damagePlayer = useCallback((damage: number) => {
    if (isGameOver) return; // Don't damage player if game is over
    
    setPlayerHealth(prev => clamp(prev - damage, 0, PLAYER_INITIAL_HEALTH));
  }, [isGameOver]);
  
  // Function to upgrade player speed
  const upgradeSpeed = useCallback(() => {
    setCurrentSpeed(prev => prev + PLAYER_SPEED_UPGRADE);
    console.log('Player speed upgraded to:', currentSpeed + PLAYER_SPEED_UPGRADE);
  }, [currentSpeed]);
  
  // Reset game function for future use
  const resetGame = useCallback(() => {
    setPlayerHealth(PLAYER_INITIAL_HEALTH);
    setPlayerPos({ x: PLAYER_X, y: PLAYER_Y });
    setIsGameOver(false);
    setCurrentSpeed(PLAYER_SPEED);
  }, []);
  
  return {
    playerPos,
    playerHealth,
    playerPosRef,
    updatePosition,
    damagePlayer,
    isGameOver,
    resetGame,
    upgradeSpeed,
    currentSpeed
  };
}; 