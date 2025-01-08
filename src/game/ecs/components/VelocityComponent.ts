import { Component, ComponentTypes } from '../core/Component';

/**
 * VelocityComponent - Represents the movement speed and direction of an entity
 */
export interface VelocityComponent extends Component {
  velocityX: number;
  velocityY: number;
  speed: number; // Base movement speed
}

/**
 * Create a new VelocityComponent
 */
export function createVelocityComponent(
  velocityX: number = 0,
  velocityY: number = 0,
  speed: number = 1
): VelocityComponent {
  return {
    type: ComponentTypes.VELOCITY,
    velocityX,
    velocityY,
    speed
  };
}

/**
 * Set the velocity direction and normalize it
 */
export function setVelocityDirection(
  velocity: VelocityComponent, 
  directionX: number, 
  directionY: number
): void {
  // If both direction components are 0, no movement
  if (directionX === 0 && directionY === 0) {
    velocity.velocityX = 0;
    velocity.velocityY = 0;
    return;
  }

  // Normalize the direction vector for consistent speed
  const length = Math.sqrt(directionX * directionX + directionY * directionY);
  
  velocity.velocityX = directionX / length;
  velocity.velocityY = directionY / length;
} 