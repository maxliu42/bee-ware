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
    
    console.warn('PLAYER SYSTEM: Initializing player system');
    
    // Check if player already exists
    const playerEntities = this.world.getEntitiesWithComponents([
      ComponentTypes.TAG
    ]).filter(entity => {
      const tag = entity.getComponent<TagComponent>(ComponentTypes.TAG);
      return tag && tag.tag === EntityTags.PLAYER;
    });
    
    console.log(`PLAYER SYSTEM: Found ${playerEntities.length} existing player entities`);
    
    // Only create player if none exists
    if (playerEntities.length === 0) {
      console.warn('PLAYER SYSTEM: Creating new player entity');
      // Create player entity
      this.playerEntity = this.createPlayer();
      
      // Add weapon timer
      this.addWeaponTimer();
      
      // Verify player entity has required components
      this.verifyPlayerComponents();
    } else {
      console.log('PLAYER SYSTEM: Player entity already exists');
      this.playerEntity = playerEntities[0];
      
      // Verify existing player entity has required components
      this.verifyPlayerComponents();
    }
  }
  
  /**
   * Verify the player entity has all required components
   */
  private verifyPlayerComponents(): void {
    if (!this.playerEntity) {
      console.error('PLAYER SYSTEM: Cannot verify components - player entity is null');
      return;
    }
    
    const id = this.playerEntity.getId();
    console.warn(`PLAYER SYSTEM: Verifying player entity ${id} components:`);
    
    const components = [
      { type: ComponentTypes.TRANSFORM, name: 'Transform' },
      { type: ComponentTypes.VELOCITY, name: 'Velocity' },
      { type: ComponentTypes.INPUT, name: 'Input' },
      { type: ComponentTypes.RENDER, name: 'Render' },
      { type: ComponentTypes.COLLIDER, name: 'Collider' },
      { type: ComponentTypes.TAG, name: 'Tag' },
      { type: ComponentTypes.HEALTH, name: 'Health' }
    ];
    
    let hasAllComponents = true;
    
    components.forEach(comp => {
      const hasComp = this.playerEntity!.hasComponent(comp.type);
      console.log(`PLAYER SYSTEM: ${comp.name} component: ${hasComp ? 'PRESENT' : 'MISSING'}`);
      
      if (!hasComp) {
        hasAllComponents = false;
      }
    });
    
    if (hasAllComponents) {
      console.warn('PLAYER SYSTEM: Player entity has all required components');
    } else {
      console.error('PLAYER SYSTEM: Player entity is missing required components');
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
    console.warn('PLAYER SYSTEM: Creating player entity with ID:', player.getId());

    // Add components to the player entity
    player.addComponent(ComponentTypes.TRANSFORM, 
      createTransformComponent(PLAYER_X, PLAYER_Y, PLAYER_SIZE, PLAYER_SIZE)
    );
    console.log('PLAYER SYSTEM: Added TRANSFORM component');
    
    player.addComponent(ComponentTypes.HEALTH, 
      createHealthComponent(PLAYER_INITIAL_HEALTH)
    );
    console.log('PLAYER SYSTEM: Added HEALTH component');
    
    player.addComponent(ComponentTypes.VELOCITY, 
      createVelocityComponent(0, 0, PLAYER_SPEED)
    );
    console.log('PLAYER SYSTEM: Added VELOCITY component');
    
    player.addComponent(ComponentTypes.INPUT, 
      createInputComponent()
    );
    console.log('PLAYER SYSTEM: Added INPUT component');
    
    player.addComponent(ComponentTypes.RENDER, 
      createRenderComponent(RenderType.PLAYER, 10)
    );
    console.log('PLAYER SYSTEM: Added RENDER component');
    
    player.addComponent(ComponentTypes.COLLIDER, 
      createColliderComponent(
        ColliderType.PLAYER,
        PLAYER_SIZE,
        PLAYER_SIZE
      )
    );
    console.log('PLAYER SYSTEM: Added COLLIDER component');
    
    player.addComponent(ComponentTypes.TAG, 
      createTagComponent(EntityTags.PLAYER)
    );
    console.log('PLAYER SYSTEM: Added TAG component');

    return player;
  }
  
  /**
   * Add a weapon timer to the player
   */
  private addWeaponTimer(): void {
    // TEMPORARILY DISABLED WEAPON TIMER FOR DEBUGGING
    console.warn('PLAYER SYSTEM: Weapon timer creation disabled for debugging');
    return;
    
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