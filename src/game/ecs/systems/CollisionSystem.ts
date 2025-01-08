import { BaseSystem } from '../core/System';
import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { TransformComponent } from '../components/TransformComponent';
import { ColliderComponent, ColliderType, checkCollision } from '../components/ColliderComponent';
import { TagComponent, EntityTags } from '../components/TagComponent';
import { HealthComponent, applyDamage, isDead } from '../components/HealthComponent';
import { ProjectileComponent, decrementPierce } from '../components/ProjectileComponent';

/**
 * CollisionEvent - Represents a collision between two entities
 */
interface CollisionEvent {
  entityA: Entity;
  entityB: Entity;
  colliderA: ColliderComponent;
  colliderB: ColliderComponent;
  transformA: TransformComponent;
  transformB: TransformComponent;
}

/**
 * CollisionSystem - Handles collision detection and resolution
 */
export class CollisionSystem extends BaseSystem {
  constructor() {
    // This system requires TransformComponent and ColliderComponent
    super([ComponentTypes.TRANSFORM, ComponentTypes.COLLIDER], 10); // Priority 10 (runs after movement but before damage)
  }

  /**
   * Update collision detection
   */
  public update(entities: Entity[], deltaTime: number): void {
    if (!this.world) return;
    
    // Collect all collision events
    const collisions: CollisionEvent[] = [];
    
    // Check collisions between all pairs of entities
    for (let i = 0; i < entities.length; i++) {
      const entityA = entities[i];
      const transformA = entityA.getComponent<TransformComponent>(ComponentTypes.TRANSFORM);
      const colliderA = entityA.getComponent<ColliderComponent>(ComponentTypes.COLLIDER);
      
      if (!transformA || !colliderA) continue;
      
      for (let j = i + 1; j < entities.length; j++) {
        const entityB = entities[j];
        const transformB = entityB.getComponent<TransformComponent>(ComponentTypes.TRANSFORM);
        const colliderB = entityB.getComponent<ColliderComponent>(ComponentTypes.COLLIDER);
        
        if (!transformB || !colliderB) continue;
        
        // Skip collision check between entities of the same type
        if (colliderA.colliderType === colliderB.colliderType) continue;
        
        // Check for collision
        const collision = checkCollision(
          transformA.x, transformA.y, colliderA,
          transformB.x, transformB.y, colliderB
        );
        
        if (collision) {
          collisions.push({
            entityA,
            entityB,
            colliderA,
            colliderB,
            transformA,
            transformB
          });
        }
      }
    }
    
    // Process all collisions
    this.processCollisions(collisions);
  }
  
  /**
   * Process all collision events
   */
  private processCollisions(collisions: CollisionEvent[]): void {
    for (const collision of collisions) {
      const { entityA, entityB, colliderA, colliderB } = collision;
      
      // Process player-enemy collisions
      if (
        (colliderA.colliderType === ColliderType.PLAYER && colliderB.colliderType === ColliderType.ENEMY) ||
        (colliderA.colliderType === ColliderType.ENEMY && colliderB.colliderType === ColliderType.PLAYER)
      ) {
        this.handlePlayerEnemyCollision(entityA, entityB, colliderA, colliderB);
      }
      
      // Process projectile-enemy collisions
      if (
        (colliderA.colliderType === ColliderType.PROJECTILE && colliderB.colliderType === ColliderType.ENEMY) ||
        (colliderA.colliderType === ColliderType.ENEMY && colliderB.colliderType === ColliderType.PROJECTILE)
      ) {
        this.handleProjectileEnemyCollision(entityA, entityB, colliderA, colliderB);
      }
    }
  }
  
  /**
   * Handle collision between player and enemy
   */
  private handlePlayerEnemyCollision(
    entityA: Entity,
    entityB: Entity,
    colliderA: ColliderComponent,
    colliderB: ColliderComponent
  ): void {
    // Determine which entity is the player and which is the enemy
    const [playerEntity, enemyEntity] = 
      colliderA.colliderType === ColliderType.PLAYER 
        ? [entityA, entityB] 
        : [entityB, entityA];
    
    // Get health components
    const playerHealth = playerEntity.getComponent<HealthComponent>(ComponentTypes.HEALTH);
    
    // Apply damage to player
    if (playerHealth && !playerHealth.isInvulnerable) {
      applyDamage(playerHealth, 1); // Player takes 1 damage from enemy touch
    }
  }
  
  /**
   * Handle collision between projectile and enemy
   */
  private handleProjectileEnemyCollision(
    entityA: Entity,
    entityB: Entity,
    colliderA: ColliderComponent,
    colliderB: ColliderComponent
  ): void {
    if (!this.world) return;
    
    // Determine which entity is the projectile and which is the enemy
    const [projectileEntity, enemyEntity] = 
      colliderA.colliderType === ColliderType.PROJECTILE 
        ? [entityA, entityB] 
        : [entityB, entityA];
    
    // Get required components
    const projectileComponent = projectileEntity.getComponent<ProjectileComponent>(ComponentTypes.PROJECTILE);
    const enemyHealth = enemyEntity.getComponent<HealthComponent>(ComponentTypes.HEALTH);
    
    if (!projectileComponent || !enemyHealth) return;
    
    // Apply damage to enemy
    const damage = applyDamage(enemyHealth, projectileComponent.damage);
    
    // Check if enemy died
    if (isDead(enemyHealth)) {
      // Mark enemy for removal
      this.world.removeEntity(enemyEntity.getId());
      
      // Add score or other effects here
    }
    
    // Decrement projectile pierce count
    const projectileUsedUp = decrementPierce(projectileComponent);
    
    // Remove projectile if no pierce left
    if (projectileUsedUp) {
      this.world.removeEntity(projectileEntity.getId());
    }
  }
} 