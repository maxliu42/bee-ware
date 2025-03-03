import { BaseSystem } from '../core/System';
import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { TransformComponent, getTransformCenter } from '../components/TransformComponent';
import { VelocityComponent } from '../components/VelocityComponent';
import { TagComponent, EntityTags } from '../components/TagComponent';
import { AIComponent, AIBehaviorType } from '../components/AIComponent';
import { setVelocityDirection } from '../../utils/PhysicsUtils';
import { getEntityWithTag } from '../utils/EntityUtils';
import { Logger } from '../../utils/LogUtils';

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
    if (!this.world) return;
    
    // Find player entity for targeting
    const playerEntity = getEntityWithTag(
      this.world.getEntitiesWithComponents([ComponentTypes.TAG, ComponentTypes.TRANSFORM]), 
      EntityTags.PLAYER
    );
    
    // If no player is found, AI can't target
    if (!playerEntity) return;
    
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
          this.handleSeekPlayer(transform, velocity, playerCenter);
          break;
        case AIBehaviorType.PATROL:
          this.handlePatrol(velocity);
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
    velocity: VelocityComponent
  ): void {
    // For simplicity, just make enemies move in a circular pattern for now
    const time = performance.now() / 1000;
    const angularSpeed = 0.5; // How fast the enemy changes direction
    
    // Calculate circular motion
    velocity.velocityX = Math.cos(time * angularSpeed);
    velocity.velocityY = Math.sin(time * angularSpeed);
  }
} 