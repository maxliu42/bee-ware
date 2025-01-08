import { BaseSystem } from '../core/System';
import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { TransformComponent } from '../components/TransformComponent';
import { VelocityComponent } from '../components/VelocityComponent';
import { STAGE_WIDTH, STAGE_HEIGHT } from '../../constants';

/**
 * MovementSystem - Updates entity positions based on their velocity
 */
export class MovementSystem extends BaseSystem {
  constructor() {
    // This system requires TransformComponent and VelocityComponent
    super([ComponentTypes.TRANSFORM, ComponentTypes.VELOCITY], 1); // Priority 1 (runs after input)
  }

  /**
   * Update entity positions based on velocity
   */
  public update(entities: Entity[], deltaTime: number): void {
    for (const entity of entities) {
      // Get transform and velocity components
      const transform = entity.getComponent<TransformComponent>(ComponentTypes.TRANSFORM);
      const velocity = entity.getComponent<VelocityComponent>(ComponentTypes.VELOCITY);
      
      if (!transform || !velocity) continue;

      // Calculate movement based on velocity and speed
      const moveX = velocity.velocityX * velocity.speed;
      const moveY = velocity.velocityY * velocity.speed;

      // Update position
      transform.x += moveX;
      transform.y += moveY;

      // Keep entities within stage boundaries
      this.keepInBounds(transform);
    }
  }

  /**
   * Keep entity within stage boundaries
   */
  private keepInBounds(transform: TransformComponent): void {
    // Clamp X position
    if (transform.x < 0) {
      transform.x = 0;
    } else if (transform.x + transform.width > STAGE_WIDTH) {
      transform.x = STAGE_WIDTH - transform.width;
    }

    // Clamp Y position
    if (transform.y < 0) {
      transform.y = 0;
    } else if (transform.y + transform.height > STAGE_HEIGHT) {
      transform.y = STAGE_HEIGHT - transform.height;
    }
  }
}