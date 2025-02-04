/**
 * Type definitions for the application
 */

// Base types
export interface Position {
  x: number;
  y: number;
}

export interface Direction {
  directionX: number;
  directionY: number;
}

// UI props types
export interface GameOverProps {
  visible: boolean;
}

export interface ScoreProps {
  score: number;
}

// Level-up types
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  apply: () => void;
}

export interface LevelUpProps {
  visible: boolean;
  upgrades: Upgrade[];
  onSelect: (upgrade: Upgrade) => void;
} 