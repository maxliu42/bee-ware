import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { World } from '../core/World';
import { TransformComponent } from '../components/TransformComponent';
import { VelocityComponent } from '../components/VelocityComponent';
import { ColliderComponent } from '../components/ColliderComponent';

/**
 * Helper to filter entities by a tag
 */
export function getEntitiesWithTag(entities: Entity[], tagValue: string): Entity[] {
  return entities.filter(entity => {
    const tag = entity.getComponent<{ tag: string }>(ComponentTypes.TAG);
    return tag?.tag === tagValue;
  });
}

/**
 * Helper to get a single entity with a specific tag
 */
export function getEntityWithTag(entities: Entity[], tagValue: string): Entity | undefined {
  const filteredEntities = getEntitiesWithTag(entities, tagValue);
  return filteredEntities.length > 0 ? filteredEntities[0] : undefined;
}

/**
 * Helper to get a single entity with a specific tag from the world
 */
export function getEntityWithTagFromWorld(world: World, tagValue: string): Entity | undefined {
  if (!world) return undefined;
  
  const entities = world.getEntitiesWithComponents([ComponentTypes.TAG]);
  return getEntityWithTag(entities, tagValue);
}

/**
 * Check if an entity is within the specified area
 */
export function isEntityInArea(
  entity: Entity,
  areaX: number,
  areaY: number,
  areaWidth: number,
  areaHeight: number
): boolean {
  const transform = entity.getComponent<TransformComponent>(ComponentTypes.TRANSFORM);
  if (!transform) return false;
  
  // Check if entity overlaps with the specified area
  return (
    transform.x < areaX + areaWidth &&
    transform.x + transform.width > areaX &&
    transform.y < areaY + areaHeight &&
    transform.y + transform.height > areaY
  );
}

/**
 * Helper to move an entity toward a target position
 */
export function moveEntityToward(
  entity: Entity,
  targetX: number,
  targetY: number,
  speed: number
): void {
  const transform = entity.getComponent<TransformComponent>(ComponentTypes.TRANSFORM);
  const velocity = entity.getComponent<VelocityComponent>(ComponentTypes.VELOCITY);
  
  if (!transform || !velocity) return;
  
  // Calculate entity center
  const entityX = transform.x + transform.width / 2;
  const entityY = transform.y + transform.height / 2;
  
  // Calculate direction vector
  const dirX = targetX - entityX;
  const dirY = targetY - entityY;
  
  // Normalize the direction
  const length = Math.sqrt(dirX * dirX + dirY * dirY);
  
  if (length > 0) {
    velocity.velocityX = dirX / length;
    velocity.velocityY = dirY / length;
    velocity.speed = speed;
  }
} 