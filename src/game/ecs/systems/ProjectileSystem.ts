import { BaseSystem } from '../core/System';
import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { TimerComponent, updateTimer, resetTimer } from '../components/TimerComponent';
import { TransformComponent, getTransformCenter } from '../components/TransformComponent';
import { TagComponent, EntityTags } from '../components/TagComponent';
import { EntityFactory } from '../factories/EntityFactory';
import { PLAYER_SIZE, PROJECTILE_SIZE } from '../../constants';

/**
 * ProjectileSystem - Handles projectile generation for entities
 */
export class ProjectileSystem extends BaseSystem {
  private factory: EntityFactory;
  
  constructor(factory: EntityFactory) {
    // This system requires TimerComponent and Transform
    super([ComponentTypes.TIMER, ComponentTypes.TRANSFORM, ComponentTypes.TAG], 6); // Priority 6
    this.factory = factory;
  }
  
  /**
   * Update the projectile system
   */
  public update(entities: Entity[], deltaTime: number): void {
    for (const entity of entities) {
      const timer = entity.getComponent<TimerComponent>(ComponentTypes.TIMER);
      const transform = entity.getComponent<TransformComponent>(ComponentTypes.TRANSFORM);
      const tag = entity.getComponent<TagComponent>(ComponentTypes.TAG);
      
      if (!timer || !transform || !tag) continue;
      
      // Only player entities can shoot projectiles for now
      if (tag.tag !== EntityTags.PLAYER) continue;
      
      // Update timer and check if it completed
      const timerCompleted = updateTimer(timer, deltaTime);
      
      // If timer completed, fire a projectile
      if (timerCompleted) {
        this.fireProjectile(entity);
      }
    }
  }
  
  /**
   * Add a weapon timer to an entity
   */
  public addWeaponTimer(entity: Entity, attackRate: number): void {
    // Add or update the timer component for weapon firing
    if (entity.hasComponent(ComponentTypes.TIMER)) {
      const timer = entity.getComponent<TimerComponent>(ComponentTypes.TIMER);
      if (timer) {
        timer.duration = attackRate;
        resetTimer(timer);
      }
    } else {
      entity.addComponent(ComponentTypes.TIMER, {
        type: ComponentTypes.TIMER,
        timeRemaining: attackRate,
        duration: attackRate,
        isLooping: true,
        isActive: true
      });
    }
  }
  
  /**
   * Fire a projectile from an entity
   */
  private fireProjectile(entity: Entity): void {
    if (!this.world) return;
    
    const transform = entity.getComponent<TransformComponent>(ComponentTypes.TRANSFORM);
    if (!transform) return;
    
    // Get entity center position
    const center = getTransformCenter(transform);
    
    // Calculate projectile start position
    const projectileX = center.x - PROJECTILE_SIZE / 2;
    const projectileY = center.y - PROJECTILE_SIZE / 2;
    
    // Generate random direction
    const angle = Math.random() * Math.PI * 2;
    const directionX = Math.cos(angle);
    const directionY = Math.sin(angle);
    
    // Create projectile entity
    this.factory.createProjectile(
      projectileX,
      projectileY,
      directionX,
      directionY,
      entity.getId()
    );
  }
} 