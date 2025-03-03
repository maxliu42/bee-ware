import { TransformComponent } from '../ecs/components/TransformComponent';
import { VelocityComponent } from '../ecs/components/VelocityComponent';
import { STAGE_WIDTH, STAGE_HEIGHT } from '../constants';

/**
 * Calculate distance between two points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate distance between two transforms
 */
export function transformDistance(t1: TransformComponent, t2: TransformComponent): number {
  const c1 = {
    x: t1.x + t1.width / 2,
    y: t1.y + t1.height / 2
  };
  
  const c2 = {
    x: t2.x + t2.width / 2,
    y: t2.y + t2.height / 2
  };
  
  return distance(c1.x, c1.y, c2.x, c2.y);
}

/**
 * Check if a point is in bounds of the stage
 */
export function isPointInBounds(x: number, y: number): boolean {
  return x >= 0 && x <= STAGE_WIDTH && y >= 0 && y <= STAGE_HEIGHT;
}

/**
 * Keep transform within stage bounds
 * @returns True if the position was clamped, false otherwise
 */
export function keepInBounds(transform: TransformComponent): boolean {
  let changed = false;
  
  // Clamp X position
  if (transform.x < 0) {
    transform.x = 0;
    changed = true;
    console.warn(`🚧 X position clamped to left bound`);
  } else if (transform.x + transform.width > STAGE_WIDTH) {
    transform.x = STAGE_WIDTH - transform.width;
    changed = true;
    console.warn(`🚧 X position clamped to right bound`);
  }

  // Clamp Y position
  if (transform.y < 0) {
    transform.y = 0;
    changed = true;
    console.warn(`🚧 Y position clamped to top bound`);
  } else if (transform.y + transform.height > STAGE_HEIGHT) {
    transform.y = STAGE_HEIGHT - transform.height;
    changed = true;
    console.warn(`🚧 Y position clamped to bottom bound`);
  }
  
  return changed;
}

/**
 * Update position based on velocity and deltaTime
 */
export function updatePosition(
  transform: TransformComponent,
  velocity: VelocityComponent,
  deltaTime: number,
  enforceBounds: boolean = true
): void {
  // Check if there's any velocity to apply
  if (velocity.velocityX === 0 && velocity.velocityY === 0) {
    return; // No movement needed
  }
  
  console.warn('------------ MOVEMENT DEBUG START ------------');
  
  // Extract current position
  const oldX = transform.x;
  const oldY = transform.y;
  
  console.warn(`🔍 Before move: transform at (${oldX.toFixed(1)},${oldY.toFixed(1)})`);
  console.warn(`🔍 Velocity: (${velocity.velocityX.toFixed(2)},${velocity.velocityY.toFixed(2)}) Speed: ${velocity.speed}`);
  
  // Simple direct movement calculation - ignore deltaTime for debugging
  const moveX = velocity.velocityX * velocity.speed * 10; // Increased multiplier for clear movement
  const moveY = velocity.velocityY * velocity.speed * 10;
  
  console.warn(`🔍 Calculated move: (${moveX.toFixed(1)},${moveY.toFixed(1)})`);
  
  // Apply movement - FORCE INTEGERS for clarity during debugging
  const newX = oldX + moveX;
  const newY = oldY + moveY;
  
  // EXPLICITLY set the new positions
  transform.x = newX;
  transform.y = newY;
  
  console.warn(`🔍 After move: transform at (${transform.x.toFixed(1)},${transform.y.toFixed(1)})`);
  
  // Log movement for debugging with high visibility
  console.warn(`🚶 MOVEMENT: (${oldX.toFixed(1)},${oldY.toFixed(1)}) → (${transform.x.toFixed(1)},${transform.y.toFixed(1)})`);
  console.warn(`🚶 MOVED BY: (${moveX.toFixed(1)},${moveY.toFixed(1)})`);
  
  // Keep in bounds if requested
  if (enforceBounds) {
    const wasClamped = keepInBounds(transform);
    if (wasClamped) {
      console.warn(`🚧 Position clamped to bounds: (${transform.x.toFixed(1)},${transform.y.toFixed(1)})`);
    }
  }
  
  console.warn('------------ MOVEMENT DEBUG END ------------');
}

/**
 * Get a normalized direction vector
 */
export function getNormalizedDirection(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): { x: number, y: number } {
  const dirX = toX - fromX;
  const dirY = toY - fromY;
  const length = Math.sqrt(dirX * dirX + dirY * dirY);
  
  if (length === 0) {
    return { x: 0, y: 0 };
  }
  
  return {
    x: dirX / length,
    y: dirY / length
  };
}

/**
 * Set velocity direction
 */
export function setVelocityDirection(
  velocity: VelocityComponent,
  directionX: number,
  directionY: number
): void {
  // Normalize the direction
  const length = Math.sqrt(directionX * directionX + directionY * directionY);
  
  if (length > 0) {
    velocity.velocityX = directionX / length;
    velocity.velocityY = directionY / length;
  } else {
    velocity.velocityX = 0;
    velocity.velocityY = 0;
  }
} 