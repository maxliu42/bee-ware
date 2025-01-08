import { World } from '../core/World';
import { Entity } from '../core/Entity';
import { 
  createTransformComponent,
  createHealthComponent,
  createVelocityComponent,
  createRenderComponent,
  createColliderComponent,
  createTagComponent,
  createInputComponent,
  createAIComponent,
  createProjectileComponent,
  EntityTags,
  RenderType,
  ColliderType,
  AIBehaviorType
} from '../components';
import {
  PLAYER_SIZE,
  PLAYER_SPEED,
  PLAYER_INITIAL_HEALTH,
  PLAYER_X,
  PLAYER_Y,
  ENEMY_SIZE,
  ENEMY_SPEED,
  ENEMY_INITIAL_HEALTH,
  PROJECTILE_SIZE,
  PROJECTILE_SPEED,
  PROJECTILE_DAMAGE,
  DEFAULT_PIERCE
} from '../../constants';

/**
 * EntityFactory - Provides methods to create common game entities
 */
export class EntityFactory {
  private world: World;

  constructor(world: World) {
    this.world = world;
  }

  /**
   * Create a player entity
   */
  public createPlayer(x: number = PLAYER_X, y: number = PLAYER_Y): Entity {
    const player = this.world.createEntity();

    // Add components to the player entity
    player.addComponent('transform', createTransformComponent(x, y, PLAYER_SIZE, PLAYER_SIZE));
    player.addComponent('health', createHealthComponent(PLAYER_INITIAL_HEALTH));
    player.addComponent('velocity', createVelocityComponent(0, 0, PLAYER_SPEED));
    player.addComponent('input', createInputComponent());
    player.addComponent('render', createRenderComponent(RenderType.PLAYER, 10));
    player.addComponent('collider', createColliderComponent(
      ColliderType.PLAYER,
      PLAYER_SIZE,
      PLAYER_SIZE
    ));
    player.addComponent('tag', createTagComponent(EntityTags.PLAYER));

    return player;
  }

  /**
   * Create an enemy entity
   */
  public createEnemy(x: number, y: number, targetEntityId?: number): Entity {
    const enemy = this.world.createEntity();

    // Add components to the enemy entity
    enemy.addComponent('transform', createTransformComponent(x, y, ENEMY_SIZE, ENEMY_SIZE));
    enemy.addComponent('health', createHealthComponent(ENEMY_INITIAL_HEALTH));
    enemy.addComponent('velocity', createVelocityComponent(0, 0, ENEMY_SPEED));
    enemy.addComponent('render', createRenderComponent(RenderType.ENEMY, 5));
    enemy.addComponent('collider', createColliderComponent(
      ColliderType.ENEMY,
      ENEMY_SIZE,
      ENEMY_SIZE
    ));
    enemy.addComponent('tag', createTagComponent(EntityTags.ENEMY));
    enemy.addComponent('ai', createAIComponent(
      AIBehaviorType.SEEK_PLAYER,
      targetEntityId
    ));

    return enemy;
  }

  /**
   * Create a projectile entity
   */
  public createProjectile(
    x: number,
    y: number,
    directionX: number,
    directionY: number,
    ownerEntityId: number
  ): Entity {
    const projectile = this.world.createEntity();

    // Add components to the projectile entity
    projectile.addComponent('transform', createTransformComponent(x, y, PROJECTILE_SIZE, PROJECTILE_SIZE));
    projectile.addComponent('velocity', createVelocityComponent(directionX, directionY, PROJECTILE_SPEED));
    projectile.addComponent('render', createRenderComponent(RenderType.PROJECTILE, 3));
    projectile.addComponent('collider', createColliderComponent(
      ColliderType.PROJECTILE,
      PROJECTILE_SIZE,
      PROJECTILE_SIZE,
      true // Is trigger (doesn't block movement)
    ));
    projectile.addComponent('tag', createTagComponent(EntityTags.PROJECTILE));
    projectile.addComponent('projectile', createProjectileComponent(
      PROJECTILE_DAMAGE,
      DEFAULT_PIERCE,
      ownerEntityId
    ));

    return projectile;
  }

  /**
   * Create a spawner entity that manages enemy spawning
   */
  public createSpawner(): Entity {
    const spawner = this.world.createEntity();
    spawner.addComponent('tag', createTagComponent(EntityTags.SPAWNER));
    return spawner;
  }
} 