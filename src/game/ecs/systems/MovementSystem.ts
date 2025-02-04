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
  private debugActive: boolean = true; // Enable debug logs temporarily

  constructor() {
    // This system requires TransformComponent and VelocityComponent
    super([ComponentTypes.TRANSFORM, ComponentTypes.VELOCITY], 1); // Priority 1 (runs after input)
  }

  /**
   * Initialize the movement system
   */
  public initialize(): void {
    this.log('Movement system initialized');
  }

  /**
   * Update entity positions based on velocity
   */
  public update(entities: Entity[], deltaTime: number): void {
    if (entities.length === 0) {
      return; // No entities to move
    }

    const dt = deltaTime;

    for (const entity of entities) {
      // Get transform and velocity components
      const transform = entity.getComponent<TransformComponent>(ComponentTypes.TRANSFORM);
      const velocity = entity.getComponent<VelocityComponent>(ComponentTypes.VELOCITY);
      
      if (!transform || !velocity) continue;

      // Calculate movement based on velocity, speed and deltaTime for consistent movement speed
      // Important: multiply by deltaTime to ensure movement is framerate-independent
      const moveX = velocity.velocityX * velocity.speed * dt * 60; // Scale by target framerate (60fps)
      const moveY = velocity.velocityY * velocity.speed * dt * 60;

      // Update position only if there's actual movement
      if (moveX !== 0 || moveY !== 0) {
        // Save old position for debugging
        const oldX = transform.x;
        const oldY = transform.y;

        // Update position
        transform.x += moveX;
        transform.y += moveY;

        // Keep entities within stage boundaries
        this.keepInBounds(transform);

        // Log movement for player entities (for debugging)
        if (entity.hasComponent(ComponentTypes.INPUT)) {
          this.log(`Player moved from (${oldX.toFixed(2)}, ${oldY.toFixed(2)}) to (${transform.x.toFixed(2)}, ${transform.y.toFixed(2)})`);
          this.log(`Speed: ${velocity.speed}, Velocity: (${velocity.velocityX}, ${velocity.velocityY})`);
        }
      }
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

  /**
   * Log debug information
   */
  private log(message: string): void {
    if (this.debugActive) {
      console.log(`MovementSystem: ${message}`);
    }
  }
}