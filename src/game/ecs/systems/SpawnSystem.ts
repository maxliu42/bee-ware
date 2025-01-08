import { BaseSystem } from '../core/System';
import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { TimerComponent, updateTimer, resetTimer } from '../components/TimerComponent';
import { EntityFactory } from '../factories/EntityFactory';
import { STAGE_WIDTH, STAGE_HEIGHT, ENEMY_SIZE } from '../../constants';

/**
 * SpawnSystem - Handles spawning of new entities in the game
 */
export class SpawnSystem extends BaseSystem {
  private factory: EntityFactory;
  private spawnerEntity: Entity | null = null;
  
  constructor(factory: EntityFactory) {
    // This system requires TimerComponent
    super([ComponentTypes.TIMER], 5); // Priority 5
    this.factory = factory;
  }
  
  /**
   * Initialize the spawn system
   */
  public initialize(): void {
    if (!this.world) return;
    
    // Create a spawner entity with a timer component
    const spawnerEntity = this.world.createEntity();
    spawnerEntity.addComponent(
      ComponentTypes.TIMER, 
      {
        type: ComponentTypes.TIMER,
        timeRemaining: 2, // Initial delay before spawning starts
        duration: 2, // Spawn interval in seconds
        isLooping: true,
        isActive: true
      }
    );
    
    this.spawnerEntity = spawnerEntity;
  }
  
  /**
   * Update the spawn system
   */
  public update(entities: Entity[], deltaTime: number): void {
    for (const entity of entities) {
      const timer = entity.getComponent<TimerComponent>(ComponentTypes.TIMER);
      if (!timer) continue;
      
      // Update timer and check if it completed
      const timerCompleted = updateTimer(timer, deltaTime);
      
      // If timer completed, spawn an enemy
      if (timerCompleted) {
        this.spawnEnemy();
      }
    }
  }
  
  /**
   * Spawn a new enemy at a random position on the edge of the screen
   */
  private spawnEnemy(): void {
    if (!this.world) return;
    
    const spawnPosition = this.generateRandomSpawnPosition();
    
    // Find player for targeting
    const playerEntities = this.world.getEntitiesWithComponents([
      ComponentTypes.TAG,
      ComponentTypes.TRANSFORM
    ]);
    
    // Get player ID for targeting, if available
    let playerEntityId: number | undefined;
    if (playerEntities.length > 0) {
      playerEntityId = playerEntities[0].getId();
    }
    
    // Create enemy entity with the factory
    this.factory.createEnemy(spawnPosition.x, spawnPosition.y, playerEntityId);
  }
  
  /**
   * Generate a random position on the edge of the screen
   */
  private generateRandomSpawnPosition(): { x: number, y: number } {
    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    
    switch (edge) {
      case 0: // top
        return {
          x: Math.random() * (STAGE_WIDTH - ENEMY_SIZE),
          y: -ENEMY_SIZE
        };
      case 1: // right
        return {
          x: STAGE_WIDTH,
          y: Math.random() * (STAGE_HEIGHT - ENEMY_SIZE)
        };
      case 2: // bottom
        return {
          x: Math.random() * (STAGE_WIDTH - ENEMY_SIZE),
          y: STAGE_HEIGHT
        };
      default: // left
        return {
          x: -ENEMY_SIZE,
          y: Math.random() * (STAGE_HEIGHT - ENEMY_SIZE)
        };
    }
  }
  
  /**
   * Clean up spawner entity
   */
  public cleanup(): void {
    if (this.world && this.spawnerEntity) {
      this.world.removeEntity(this.spawnerEntity.getId());
      this.spawnerEntity = null;
    }
  }
} 