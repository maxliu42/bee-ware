import { BaseSystem } from '../core/System';
import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { TimerComponent, updateTimer, resetTimer } from '../components/TimerComponent';
import { TransformComponent, getTransformCenter } from '../components/TransformComponent';
import { TagComponent, EntityTags } from '../components/TagComponent';
import { 
  createProjectileComponent, 
  createTransformComponent,
  createVelocityComponent,
  createRenderComponent,
  createColliderComponent,
  createTagComponent,
  RenderType,
  ColliderType
} from '../components';
import {PROJECTILE_SIZE, PROJECTILE_SPEED, PROJECTILE_DAMAGE, DEFAULT_PIERCE } from '../../constants';

/**
 * ProjectileSystem - Handles projectile generation for entities
 */
export class ProjectileSystem extends BaseSystem {
  
  constructor() {
    // This system requires TimerComponent and Transform
    super([ComponentTypes.TIMER, ComponentTypes.TRANSFORM, ComponentTypes.TAG], 6); // Priority 6
  }
  
  /**
   * Initialize the projectile system
   */
  public initialize(): void {
    // Nothing to initialize
  }
  
  /**
   * Clean up the projectile system
   */
  public cleanup(): void {
    // Nothing to clean up
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
    
    // Create projectile entity directly rather than using a factory
    const projectile = this.world.createEntity();
    
    // Add components
    projectile.addComponent(ComponentTypes.TRANSFORM, 
      createTransformComponent(projectileX, projectileY, PROJECTILE_SIZE, PROJECTILE_SIZE)
    );
    projectile.addComponent(ComponentTypes.VELOCITY, 
      createVelocityComponent(directionX, directionY, PROJECTILE_SPEED)
    );
    projectile.addComponent(ComponentTypes.RENDER, 
      createRenderComponent(RenderType.PROJECTILE, 3)
    );
    projectile.addComponent(ComponentTypes.COLLIDER, 
      createColliderComponent(
        ColliderType.PROJECTILE,
        PROJECTILE_SIZE,
        PROJECTILE_SIZE,
        true // Is trigger (doesn't block movement)
      )
    );
    projectile.addComponent(ComponentTypes.TAG, 
      createTagComponent(EntityTags.PROJECTILE)
    );
    projectile.addComponent(ComponentTypes.PROJECTILE, 
      createProjectileComponent(
        PROJECTILE_DAMAGE,
        DEFAULT_PIERCE,
        entity.getId()
      )
    );
  }
} 