import { ComponentTypes } from '../core/Component';

/**
 * Component Type for GameStateComponent
 */
export const GAME_STATE_COMPONENT = ComponentTypes.GAME_STATE;

/**
 * Represents the overall state of the game
 */
export interface GameStateComponent {
  isPaused: boolean;
  isGameOver: boolean;
  showLevelUp: boolean;
  currentLevel: number;
}

/**
 * Create a new GameStateComponent with default values
 */
export function createGameStateComponent(): GameStateComponent {
  return {
    isPaused: false,
    isGameOver: false,
    showLevelUp: false,
    currentLevel: 1
  };
}

/**
 * Set the paused state
 */
export function setPaused(component: GameStateComponent, isPaused: boolean): void {
  component.isPaused = isPaused;
}

/**
 * Set the game over state
 */
export function setGameOver(component: GameStateComponent, isGameOver: boolean): void {
  component.isGameOver = isGameOver;
  
  // Pause the game when game over
  if (isGameOver) {
    component.isPaused = true;
  }
}

/**
 * Set the level up state
 */
export function setShowLevelUp(component: GameStateComponent, showLevelUp: boolean): void {
  component.showLevelUp = showLevelUp;
  
  // Pause the game during level up
  if (showLevelUp) {
    component.isPaused = true;
  } else if (!component.isGameOver) {
    // Only unpause if not game over
    component.isPaused = false;
  }
}

/**
 * Level up the game
 */
export function levelUp(component: GameStateComponent): void {
  component.currentLevel++;
  setShowLevelUp(component, true);
} 