import { Component, ComponentTypes } from '../core/Component';

/**
 * Available collider types
 */
export enum ColliderType {
  PLAYER = 'player',
  ENEMY = 'enemy',
  PROJECTILE = 'projectile',
  PICKUP = 'pickup'
}

/**
 * ColliderComponent - Represents the collision properties of an entity
 */
export interface ColliderComponent extends Component {
  type: typeof ComponentTypes.COLLIDER;
  colliderType: ColliderType;
  isTrigger: boolean; // If true, this collider doesn't block movement but still triggers collision events
  offsetX: number; // Offset from the entity's position
  offsetY: number;
  width: number; // Can be different from the transform's width/height
  height: number;
}

/**
 * Create a new ColliderComponent
 */
export function createColliderComponent(
  colliderType: ColliderType,
  width: number,
  height: number,
  isTrigger: boolean = false,
  offsetX: number = 0,
  offsetY: number = 0
): ColliderComponent {
  return {
    type: ComponentTypes.COLLIDER,
    colliderType,
    isTrigger,
    offsetX,
    offsetY,
    width,
    height
  };
}

/**
 * Check if two colliders are intersecting
 */
export function checkCollision(
  x1: number, y1: number, collider1: ColliderComponent,
  x2: number, y2: number, collider2: ColliderComponent
): boolean {
  // Calculate actual collider positions with offsets
  const c1x = x1 + collider1.offsetX;
  const c1y = y1 + collider1.offsetY;
  const c2x = x2 + collider2.offsetX;
  const c2y = y2 + collider2.offsetY;

  // Check for intersection
  return (
    c1x < c2x + collider2.width &&
    c1x + collider1.width > c2x &&
    c1y < c2y + collider2.height &&
    c1y + collider1.height > c2y
  );
} 