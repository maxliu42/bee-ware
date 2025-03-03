import { BaseSystem } from '../core/System';
import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { TransformComponent } from '../components/TransformComponent';
import { VelocityComponent } from '../components/VelocityComponent';
import { updatePosition } from '../../utils/PhysicsUtils';
import { Logger } from '../../utils/LogUtils';

/**
 * MovementSystem - Updates entity positions based on their velocity
 */
export class MovementSystem extends BaseSystem {
  constructor() {
    // This system requires TransformComponent and VelocityComponent
    super([ComponentTypes.TRANSFORM, ComponentTypes.VELOCITY], 1); // Priority 1 (runs after input)
  }

  /**
   * Initialize the movement system
   */
  public initialize(): void {
    Logger.log('MovementSystem', 'Movement system initialized');
    console.warn('MOVEMENT SYSTEM: Initialized - Will process entities with TRANSFORM and VELOCITY components');
  }

  /**
   * Update entity positions based on velocity
   */
  public update(entities: Entity[], deltaTime: number): void {
    if (entities.length === 0) {
      return; // No entities to move
    }

    console.log(`MOVEMENT SYSTEM: Processing ${entities.length} entities`);
    const dt = deltaTime;

    for (const entity of entities) {
      // Get transform and velocity components
      const transform = entity.getComponent<TransformComponent>(ComponentTypes.TRANSFORM);
      const velocity = entity.getComponent<VelocityComponent>(ComponentTypes.VELOCITY);
      
      if (!transform || !velocity) {
        console.warn(`MOVEMENT SYSTEM: Entity ${entity.getId()} missing required components`);
        continue;
      }

      // Skip entities that aren't moving but log them
      if (velocity.velocityX === 0 && velocity.velocityY === 0) {
        console.log(`MOVEMENT SYSTEM: Entity ${entity.getId()} has zero velocity, skipping`);
        continue;
      }

      console.warn(`MOVEMENT SYSTEM: Moving entity ${entity.getId()}`);
      
      // Save old position for debugging
      const oldX = transform.x;
      const oldY = transform.y;

      // Update position using our physics utility
      updatePosition(transform, velocity, dt);

      // Log movement for player entities (for debugging)
      if (entity.hasComponent(ComponentTypes.INPUT)) {
        const msg = `Player moved from (${oldX.toFixed(2)}, ${oldY.toFixed(2)}) to (${transform.x.toFixed(2)}, ${transform.y.toFixed(2)})`;
        const velMsg = `Speed: ${velocity.speed}, Velocity: (${velocity.velocityX.toFixed(2)}, ${velocity.velocityY.toFixed(2)})`;
        
        console.warn('MOVEMENT RESULT: ' + msg);
        console.warn('MOVEMENT RESULT: ' + velMsg);
        
        Logger.log('MovementSystem', msg);
        Logger.log('MovementSystem', velMsg);
      }
    }
  }
}