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
  private debugActive: boolean = true; // Enable debug mode for troubleshooting
  private keyPressLogged: { [key: string]: boolean } = {}; // Track which keys have been logged

  constructor() {
    // This system requires InputComponent and VelocityComponent
    super([ComponentTypes.INPUT, ComponentTypes.VELOCITY], 0); // Priority 0 (runs first)
    
    // Initialize empty key state
    this.keyState = {};
    this.keyPressLogged = {};
  }

  /**
   * Set up event listeners for keyboard input
   */
  public initialize(): void {
    this.log('Initializing input system');
    
    // Set up keyboard event listeners
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    
    // Log current key bindings
    this.log('Movement controls: W/↑ (up), S/↓ (down), A/← (left), D/→ (right)');
    
    // Test key event listener setup
    this.log('Keyboard event listeners setup complete');
  }

  /**
   * Clean up event listeners
   */
  public cleanup(): void {
    this.log('Cleaning up input system');
    
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
    
    // Log the key press only once (avoid console spam)
    if (!this.keyPressLogged[key] && this.isMovementKey(key)) {
      this.keyPressLogged[key] = true;
      this.log(`Key pressed: ${key}`);
    }
  };

  /**
   * Handle keyup events
   */
  private handleKeyUp = (event: KeyboardEvent): void => {
    // Convert key to lowercase for consistency
    const key = event.key.toLowerCase();
    this.keyState[key] = false;
    
    // Reset the logged state so we can log this key again
    if (this.keyPressLogged[key]) {
      this.keyPressLogged[key] = false;
      this.log(`Key released: ${key}`);
    }
  };

  /**
   * Check if a key is a movement key
   */
  private isMovementKey(key: string): boolean {
    return ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key);
  }

  /**
   * Update input components based on current key state
   */
  public update(entities: Entity[], _deltaTime: number): void {
    if (entities.length === 0) {
      return; // No entities to process
    }
    
    // Create a debug summary of the current state
    const activeKeys = Object.keys(this.keyState).filter(key => this.keyState[key]);
    if (activeKeys.length > 0) {
      this.log(`Active keys: ${activeKeys.join(', ')}`);
    }
    
    for (const entity of entities) {
      // Get input component
      const input = entity.getComponent<InputComponent>(ComponentTypes.INPUT);
      if (!input) continue;

      // Previous state for change detection
      const prevUp = input.up;
      const prevDown = input.down;
      const prevLeft = input.left;
      const prevRight = input.right;

      // Update input component based on key state
      input.up = this.keyState['w'] || this.keyState['arrowup'] || false;
      input.down = this.keyState['s'] || this.keyState['arrowdown'] || false;
      input.left = this.keyState['a'] || this.keyState['arrowleft'] || false;
      input.right = this.keyState['d'] || this.keyState['arrowright'] || false;

      // Check if input state changed
      const inputChanged = 
        prevUp !== input.up || 
        prevDown !== input.down || 
        prevLeft !== input.left || 
        prevRight !== input.right;
      
      if (inputChanged) {
        this.log(`Input changed: up=${input.up}, down=${input.down}, left=${input.left}, right=${input.right}`);
      }

      // Get velocity component
      const velocity = entity.getComponent<VelocityComponent>(ComponentTypes.VELOCITY);
      if (!velocity) continue;

      // Calculate direction from input
      const [directionX, directionY] = getInputDirection(input);
      
      // Update velocity direction
      const prevVelX = velocity.velocityX;
      const prevVelY = velocity.velocityY;
      
      setVelocityDirection(velocity, directionX, directionY);
      
      // Log velocity changes
      if (prevVelX !== velocity.velocityX || prevVelY !== velocity.velocityY) {
        this.log(`Velocity updated: (${velocity.velocityX.toFixed(2)}, ${velocity.velocityY.toFixed(2)}), speed: ${velocity.speed}`);
      }
    }
  }
  
  /**
   * Log debug information
   */
  private log(message: string): void {
    if (this.debugActive) {
      console.log(`InputSystem: ${message}`);
    }
  }
} 