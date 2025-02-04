import { BaseSystem } from '../core/System';
import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { 
  createTransformComponent,
  createHealthComponent,
  createVelocityComponent,
  createRenderComponent,
  createColliderComponent,
  createTagComponent,
  createInputComponent,
  EntityTags,
  RenderType,
  ColliderType,
  TagComponent
} from '../components';
import {
  PLAYER_SIZE,
  PLAYER_SPEED,
  PLAYER_INITIAL_HEALTH,
  PLAYER_X,
  PLAYER_Y,
  ATTACK_RATE
} from '../../constants';

/**
 * PlayerSystem - Manages the player entity
 */
export class PlayerSystem extends BaseSystem {
  private playerEntity: Entity | null = null;
  
  constructor() {
    // No specific components required for this system
    super([], 0); // Priority 0 (runs very early)
  }
  
  /**
   * Initialize the player system
   */
  public initialize(): void {
    if (!this.world) {
      console.error('PlayerSystem: World not initialized');
      return;
    }
    
    // Check if player already exists
    const playerEntities = this.world.getEntitiesWithComponents([
      ComponentTypes.TAG
    ]).filter(entity => {
      const tag = entity.getComponent<TagComponent>(ComponentTypes.TAG);
      return tag && tag.tag === EntityTags.PLAYER;
    });
    
    // Only create player if none exists
    if (playerEntities.length === 0) {
      console.log('PlayerSystem: Creating new player entity');
      // Create player entity
      this.playerEntity = this.createPlayer();
      
      // Add weapon timer
      this.addWeaponTimer();
    } else {
      console.log('PlayerSystem: Player entity already exists');
      this.playerEntity = playerEntities[0];
    }
  }
  
  /**
   * Update the player system
   */
  public update(_entities: Entity[], _deltaTime: number): void {
    // Ensure player entity exists
    if (!this.playerEntity && this.world) {
      console.log('PlayerSystem: Player entity missing, recreating');
      this.initialize();
    }
  }
  
  /**
   * Clean up the player system
   */
  public cleanup(): void {
    this.playerEntity = null;
  }
  
  /**
   * Create a player entity
   */
  private createPlayer(): Entity {
    if (!this.world) {
      throw new Error("Cannot create player entity: world is not initialized");
    }
    
    const player = this.world.createEntity();
    console.log('Creating player entity with ID:', player.getId());

    // Add components to the player entity
    player.addComponent(ComponentTypes.TRANSFORM, 
      createTransformComponent(PLAYER_X, PLAYER_Y, PLAYER_SIZE, PLAYER_SIZE)
    );
    player.addComponent(ComponentTypes.HEALTH, 
      createHealthComponent(PLAYER_INITIAL_HEALTH)
    );
    player.addComponent(ComponentTypes.VELOCITY, 
      createVelocityComponent(0, 0, PLAYER_SPEED)
    );
    player.addComponent(ComponentTypes.INPUT, 
      createInputComponent()
    );
    player.addComponent(ComponentTypes.RENDER, 
      createRenderComponent(RenderType.PLAYER, 10)
    );
    player.addComponent(ComponentTypes.COLLIDER, 
      createColliderComponent(
        ColliderType.PLAYER,
        PLAYER_SIZE,
        PLAYER_SIZE
      )
    );
    player.addComponent(ComponentTypes.TAG, 
      createTagComponent(EntityTags.PLAYER)
    );

    return player;
  }
  
  /**
   * Add a weapon timer to the player
   */
  private addWeaponTimer(): void {
    if (!this.playerEntity) {
      console.error('Cannot add weapon timer: player entity is null');
      return;
    }
    
    // Add timer component for weapon firing
    this.playerEntity.addComponent(ComponentTypes.TIMER, {
      type: ComponentTypes.TIMER,
      timeRemaining: ATTACK_RATE / 1000, // Convert ms to seconds
      duration: ATTACK_RATE / 1000,
      isLooping: true,
      isActive: true
    });
  }
  
  /**
   * Get the player entity
   */
  public getPlayerEntity(): Entity | null {
    return this.playerEntity;
  }
} 