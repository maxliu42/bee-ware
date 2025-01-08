import { BaseSystem } from '../core/System';
import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { InputComponent, getInputDirection } from '../components/InputComponent';
import { VelocityComponent, setVelocityDirection } from '../components/VelocityComponent';

/**
 * InputSystem - Handles keyboard input and updates entity input and velocity components
 */
export class InputSystem extends BaseSystem {
  private keyState: { [key: string]: boolean } = {};

  constructor() {
    // This system requires InputComponent and VelocityComponent
    super([ComponentTypes.INPUT, ComponentTypes.VELOCITY], 0); // Priority 0 (runs first)
    
    // Initialize empty key state
    this.keyState = {};
  }

  /**
   * Set up event listeners for keyboard input
   */
  public initialize(): void {
    // Set up keyboard event listeners
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Clean up event listeners
   */
  public cleanup(): void {
    // Remove keyboard event listeners
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    // Convert key to lowercase for consistency
    const key = event.key.toLowerCase();
    this.keyState[key] = true;
  };

  /**
   * Handle keyup events
   */
  private handleKeyUp = (event: KeyboardEvent): void => {
    // Convert key to lowercase for consistency
    const key = event.key.toLowerCase();
    this.keyState[key] = false;
  };

  /**
   * Update input components based on current key state
   */
  public update(entities: Entity[], deltaTime: number): void {
    for (const entity of entities) {
      // Get input component
      const input = entity.getComponent<InputComponent>(ComponentTypes.INPUT);
      if (!input) continue;

      // Update input component based on key state
      input.up = this.keyState['w'] || this.keyState['arrowup'] || false;
      input.down = this.keyState['s'] || this.keyState['arrowdown'] || false;
      input.left = this.keyState['a'] || this.keyState['arrowleft'] || false;
      input.right = this.keyState['d'] || this.keyState['arrowright'] || false;

      // Get velocity component
      const velocity = entity.getComponent<VelocityComponent>(ComponentTypes.VELOCITY);
      if (!velocity) continue;

      // Calculate direction from input
      const [directionX, directionY] = getInputDirection(input);
      
      // Update velocity direction
      setVelocityDirection(velocity, directionX, directionY);
    }
  }
} 