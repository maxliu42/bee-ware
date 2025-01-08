import { Component, ComponentTypes } from '../core/Component';

/**
 * AI behavior types
 */
export enum AIBehaviorType {
  SEEK_PLAYER = 'seekPlayer',
  PATROL = 'patrol',
  IDLE = 'idle'
}

/**
 * AIComponent - Controls non-player entity behavior
 */
export interface AIComponent extends Component {
  behaviorType: AIBehaviorType;
  targetEntityId?: number; // For behaviors that target a specific entity
  detectionRadius?: number; // For behaviors that activate when player is close
}

/**
 * Create a new AIComponent
 */
export function createAIComponent(
  behaviorType: AIBehaviorType = AIBehaviorType.SEEK_PLAYER,
  targetEntityId?: number,
  detectionRadius?: number
): AIComponent {
  return {
    type: ComponentTypes.AI,
    behaviorType,
    targetEntityId,
    detectionRadius
  };
} 