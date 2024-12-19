import { useState, useEffect, useRef, useCallback } from 'react';
import { Position } from '../../types/types';
import { 
  PLAYER_SPEED, 
  PLAYER_SIZE, 
  STAGE_WIDTH, 
  STAGE_HEIGHT,
  PLAYER_INITIAL_HEALTH,
  PLAYER_X,
  PLAYER_Y
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
  const [currentMaxHealth, setCurrentMaxHealth] = useState(PLAYER_INITIAL_HEALTH);
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
      let newX = prevPos.x;
      let newY = prevPos.y;

      // Check each movement key and update position accordingly
      if (keys['w'] || keys['arrowup']) {
        newY = prevPos.y - currentSpeed;
      }
      if (keys['s'] || keys['arrowdown']) {
        newY = prevPos.y + currentSpeed;
      }
      if (keys['a'] || keys['arrowleft']) {
        newX = prevPos.x - currentSpeed;
      }
      if (keys['d'] || keys['arrowright']) {
        newX = prevPos.x + currentSpeed;
      }

      // Use utility function to keep player in bounds
      return keepInBounds({ x: newX, y: newY }, PLAYER_SIZE);
    });
  }, [keys, isGameOver, currentSpeed]);
  
  // Function to damage the player
  const damagePlayer = useCallback((damage: number) => {
    if (isGameOver) return; // Don't damage player if game is over
    
    setPlayerHealth(prev => clamp(prev - damage, 0, currentMaxHealth));
  }, [isGameOver, currentMaxHealth]);
  
  // Function to increase player's movement speed
  const increaseSpeed = useCallback((amount: number) => {
    setCurrentSpeed(prev => prev + amount);
  }, []);
  
  // Function to increase player's maximum health
  const increaseMaxHealth = useCallback((amount: number) => {
    setCurrentMaxHealth(prev => prev + amount);
    // Also heal the player by the same amount
    setPlayerHealth(prev => clamp(prev + amount, 0, currentMaxHealth + amount));
  }, [currentMaxHealth]);
  
  // Reset game function for future use
  const resetGame = useCallback(() => {
    setPlayerHealth(PLAYER_INITIAL_HEALTH);
    setPlayerPos({ x: PLAYER_X, y: PLAYER_Y });
    setIsGameOver(false);
    setCurrentMaxHealth(PLAYER_INITIAL_HEALTH);
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
    increaseSpeed,
    increaseMaxHealth,
    currentMaxHealth
  };
}; 