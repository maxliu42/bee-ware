import { BaseSystem } from '../core/System';
import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { TimerComponent, updateTimer } from '../components/TimerComponent';
import { 
  createTransformComponent,
  createHealthComponent,
  createVelocityComponent,
  createRenderComponent,
  createColliderComponent,
  createTagComponent,
  createAIComponent,
  EntityTags,
  RenderType,
  ColliderType,
  AIBehaviorType,
  TagComponent
} from '../components';
import { 
  STAGE_WIDTH, 
  STAGE_HEIGHT, 
  ENEMY_SIZE, 
  ENEMY_SPEED, 
  ENEMY_INITIAL_HEALTH,
  MAX_ENEMIES,
  INITIAL_SPAWN_DELAY,
  BASE_SPAWN_INTERVAL,
  MIN_SPAWN_INTERVAL,
  SPAWN_RATE_PROGRESSION
} from '../../constants';

/**
 * SpawnSystem - Handles spawning of new entities in the game
 */
export class SpawnSystem extends BaseSystem {
  private spawnerEntity: Entity | null = null;
  private spawnCount: number = 0;
  private gameStartTime: number = 0;
  
  constructor() {
    // This system requires TimerComponent
    super([ComponentTypes.TIMER], 5); // Priority 5
  }
  
  /**
   * Initialize the spawn system
   */
  public initialize(): void {
    if (!this.world) {
      console.error('SpawnSystem: World is not initialized');
      return;
    }
    
    // Record game start time
    this.gameStartTime = performance.now();
    this.spawnCount = 0;
    
    // Check if spawner already exists
    const spawnerEntities = this.world.getEntitiesWithComponents([
      ComponentTypes.TIMER
    ]);
    
    // Only create a new spawner if none exists
    if (spawnerEntities.length === 0 || !this.spawnerEntity) {
      // Calculate initial spawn interval
      const spawnInterval = this.calculateSpawnInterval();
      
      // Create a spawner entity with a timer component
      const spawnerEntity = this.world.createEntity();
      spawnerEntity.addComponent(
        ComponentTypes.TIMER, 
        {
          type: ComponentTypes.TIMER,
          timeRemaining: INITIAL_SPAWN_DELAY,
          duration: spawnInterval,
          isLooping: true,
          isActive: true
        }
      );
      
      this.spawnerEntity = spawnerEntity;
      
      // Force spawn one enemy immediately for testing
      this.spawnEnemy();
    } else {
      // Use first spawner found
      this.spawnerEntity = spawnerEntities[0];
    }
  }
  
  /**
   * Update the spawn system
   */
  public update(entities: Entity[], deltaTime: number): void {
    // If no entities with timer, recheck our spawner
    if (entities.length === 0 && this.world) {
      this.initialize();
      return;
    }
    
    for (const entity of entities) {
      const timer = entity.getComponent<TimerComponent>(ComponentTypes.TIMER);
      if (!timer) continue;
      
      // Update timer and check if it completed
      const timerCompleted = updateTimer(timer, deltaTime);
      
      // If timer completed, spawn an enemy and update the spawn interval
      if (timerCompleted) {
        this.spawnEnemy();
        
        // Update spawn interval based on game progress
        if (this.spawnerEntity) {
          const newSpawnInterval = this.calculateSpawnInterval();
          const timer = this.spawnerEntity.getComponent<TimerComponent>(ComponentTypes.TIMER);
          if (timer) {
            timer.duration = newSpawnInterval;
          }
        }
      }
    }
  }
  
  /**
   * Calculate the appropriate spawn interval based on game progress
   */
  private calculateSpawnInterval(): number {
    // Time-based progression: spawn rate increases over time
    const gameTimeSeconds = (performance.now() - this.gameStartTime) / 1000;
    
    // Calculate spawn interval using an exponential decay formula
    const spawnInterval = BASE_SPAWN_INTERVAL * 
      Math.exp(-gameTimeSeconds / SPAWN_RATE_PROGRESSION);
    
    // Ensure it doesn't go below minimum spawn interval
    return Math.max(spawnInterval, MIN_SPAWN_INTERVAL);
  }
  
  /**
   * Spawn a new enemy at a random position on the edge of the screen
   */
  private spawnEnemy(): void {
    if (!this.world) {
      console.error('SpawnSystem: Cannot spawn enemy, world is null');
      return;
    }
    
    // Check how many enemies already exist - limit to avoid performance issues
    const enemies = this.world.getEntitiesWithComponents([
      ComponentTypes.TAG
    ]).filter(entity => {
      const tag = entity.getComponent<TagComponent>(ComponentTypes.TAG);
      return tag && tag.tag === EntityTags.ENEMY;
    });
    
    // Limit to a maximum number of enemies for performance
    if (enemies.length >= MAX_ENEMIES) {
      return;
    }
    
    const spawnPosition = this.generateRandomSpawnPosition();
    
    // Find player for targeting
    const playerEntities = this.world.getEntitiesWithComponents([
      ComponentTypes.TAG,
      ComponentTypes.TRANSFORM
    ]).filter(entity => {
      const tag = entity.getComponent<TagComponent>(ComponentTypes.TAG);
      return tag && tag.tag === EntityTags.PLAYER;
    });
    
    // Get player ID for targeting, if available
    let playerEntityId: number | undefined;
    if (playerEntities.length > 0) {
      playerEntityId = playerEntities[0].getId();
    }
    
    // Create enemy entity directly
    const enemy = this.world.createEntity();
    
    // Increment spawn count
    this.spawnCount++;
    
    // Add components to the enemy entity
    enemy.addComponent(ComponentTypes.TRANSFORM, 
      createTransformComponent(spawnPosition.x, spawnPosition.y, ENEMY_SIZE, ENEMY_SIZE)
    );
    enemy.addComponent(ComponentTypes.HEALTH, 
      createHealthComponent(ENEMY_INITIAL_HEALTH)
    );
    enemy.addComponent(ComponentTypes.VELOCITY, 
      createVelocityComponent(0, 0, ENEMY_SPEED)
    );
    enemy.addComponent(ComponentTypes.RENDER, 
      createRenderComponent(RenderType.ENEMY, 5)
    );
    enemy.addComponent(ComponentTypes.COLLIDER, 
      createColliderComponent(
        ColliderType.ENEMY,
        ENEMY_SIZE,
        ENEMY_SIZE
      )
    );
    enemy.addComponent(ComponentTypes.TAG, 
      createTagComponent(EntityTags.ENEMY)
    );
    enemy.addComponent(ComponentTypes.AI, 
      createAIComponent(
        AIBehaviorType.SEEK_PLAYER,
        playerEntityId
      )
    );
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
  
  /**
   * Get the current spawn count
   */
  public getSpawnCount(): number {
    return this.spawnCount;
  }
} 