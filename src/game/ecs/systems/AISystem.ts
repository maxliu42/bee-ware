import { BaseSystem } from '../core/System';
import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { TransformComponent, getTransformCenter } from '../components/TransformComponent';
import { VelocityComponent, setVelocityDirection } from '../components/VelocityComponent';
import { TagComponent, EntityTags } from '../components/TagComponent';
import { AIComponent, AIBehaviorType } from '../components/AIComponent';

/**
 * AISystem - Controls enemy behavior based on AI components
 */
export class AISystem extends BaseSystem {
  constructor() {
    // This system requires AIComponent, TransformComponent, and VelocityComponent
    super([ComponentTypes.AI, ComponentTypes.TRANSFORM, ComponentTypes.VELOCITY], 2); // Priority 2 (runs after movement)
  }

  /**
   * Update AI-controlled entities
   */
  public update(entities: Entity[], deltaTime: number): void {
    // Find player entity for targeting
    const playerEntities = this.world?.getEntitiesWithComponents([
      ComponentTypes.TAG,
      ComponentTypes.TRANSFORM
    ]).filter((entity: Entity) => {
      const tag = entity.getComponent<TagComponent>(ComponentTypes.TAG);
      return tag?.tag === EntityTags.PLAYER;
    }) || [];

    // If no player is found, AI can't target
    if (playerEntities.length === 0) return;

    // Get the first player found
    const playerEntity = playerEntities[0];
    const playerTransform = playerEntity.getComponent<TransformComponent>(ComponentTypes.TRANSFORM);
    if (!playerTransform) return;

    // Get player center position
    const playerCenter = getTransformCenter(playerTransform);

    // Process each AI entity
    for (const entity of entities) {
      const ai = entity.getComponent<AIComponent>(ComponentTypes.AI);
      const transform = entity.getComponent<TransformComponent>(ComponentTypes.TRANSFORM);
      const velocity = entity.getComponent<VelocityComponent>(ComponentTypes.VELOCITY);
      
      if (!ai || !transform || !velocity) continue;

      // Handle different AI behaviors
      switch (ai.behaviorType) {
        case AIBehaviorType.SEEK_PLAYER:
          this.handleSeekPlayer(entity, transform, velocity, playerCenter);
          break;
        case AIBehaviorType.PATROL:
          this.handlePatrol(entity, transform, velocity, deltaTime);
          break;
        case AIBehaviorType.IDLE:
          // Do nothing for idle entities
          velocity.velocityX = 0;
          velocity.velocityY = 0;
          break;
      }
    }
  }

  /**
   * Handle seek player behavior - move toward player position
   */
  private handleSeekPlayer(
    _entity: Entity,
    transform: TransformComponent,
    velocity: VelocityComponent,
    playerCenter: { x: number, y: number }
  ): void {
    // Calculate entity center
    const entityCenter = getTransformCenter(transform);
    
    // Calculate direction to player
    const directionX = playerCenter.x - entityCenter.x;
    const directionY = playerCenter.y - entityCenter.y;
    
    // Set velocity direction to approach player
    setVelocityDirection(velocity, directionX, directionY);
  }

  /**
   * Handle patrol behavior - move in patterns
   * (Basic implementation for now, can be expanded later)
   */
  private handlePatrol(
    _entity: Entity,
    _transform: TransformComponent,
    velocity: VelocityComponent, 
    _deltaTime: number
  ): void {
    // For simplicity, just make enemies move in a circular pattern for now
    const time = performance.now() / 1000;
    const angularSpeed = 0.5; // How fast the enemy changes direction
    
    // Calculate circular motion
    velocity.velocityX = Math.cos(time * angularSpeed);
    velocity.velocityY = Math.sin(time * angularSpeed);
  }
} 