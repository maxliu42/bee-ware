import { BaseSystem } from '../core/System';
import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { InputComponent, getInputDirection } from '../components/InputComponent';
import { VelocityComponent, setVelocityDirection } from '../components/VelocityComponent';

/**
 * InputSystem - Handles keyboard input and updates entity input and velocity components
 */
export class InputSystem extends BaseSystem {
  // Use a global key state object that's shared across instances
  private static globalKeyState: { [key: string]: boolean } = {};
  private debugActive: boolean = true; // Enable debug mode for troubleshooting
  
  constructor() {
    // This system requires InputComponent and VelocityComponent
    super([ComponentTypes.INPUT, ComponentTypes.VELOCITY], 0); // Priority 0 (runs first)
    
    // Initialize the global key state if not already initialized
    if (Object.keys(InputSystem.globalKeyState).length === 0) {
      this.setupGlobalKeyListeners();
    }
  }

  /**
   * Set up global key listeners that will work across instances
   */
  private setupGlobalKeyListeners(): void {
    console.warn('SETTING UP GLOBAL KEY LISTENERS');
    
    // Function to handle key down events
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent browser shortcuts from interfering with game inputs
      if (this.isMovementKey(event.key)) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      const key = event.key.toLowerCase();
      InputSystem.globalKeyState[key] = true;
      console.warn(`GLOBAL KEY DOWN: ${key}`);
    };
    
    // Function to handle key up events
    const handleKeyUp = (event: KeyboardEvent) => {
      // Prevent browser shortcuts from interfering with game inputs
      if (this.isMovementKey(event.key)) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      const key = event.key.toLowerCase();
      InputSystem.globalKeyState[key] = false;
      console.warn(`GLOBAL KEY UP: ${key}`);
    };
    
    // We need to add event listeners to multiple elements to catch all possible events
    // Use capture phase to get events before they bubble up
    const addListeners = (element: HTMLElement | Document) => {
      element.addEventListener('keydown', ((event: Event) => {
        handleKeyDown(event as KeyboardEvent);
      }) as EventListener, true);
      
      element.addEventListener('keyup', ((event: Event) => {
        handleKeyUp(event as KeyboardEvent);
      }) as EventListener, true);
    };
    
    // Add to document and window
    addListeners(document);
    addListeners(document.body);
    
    // Also try to get the game container if it exists
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer instanceof HTMLElement) {
      addListeners(gameContainer);
      console.warn('Added key listeners to game container');
    }
    
    // Test handler (will trigger once with any key press)
    const testHandler = () => {
      console.warn('✅ TEST KEY EVENT DETECTED - Global listeners are working');
      document.removeEventListener('keydown', testHandler);
    };
    document.addEventListener('keydown', testHandler);
    
    // Log the current key state periodically
    setInterval(() => {
      const activeKeys = Object.keys(InputSystem.globalKeyState)
        .filter(key => InputSystem.globalKeyState[key]);
      
      if (activeKeys.length > 0) {
        console.warn(`⌨️ ACTIVE KEYS (interval): ${activeKeys.join(', ')}`);
      }
    }, 1000);
    
    // Log the setup
    console.warn('GLOBAL KEY LISTENERS INITIALIZED');
  }

  /**
   * Initialize the input system
   */
  public initialize(): void {
    console.warn('INPUT SYSTEM: Initializing - Press WASD or arrow keys to move');
  }

  /**
   * Clean up event listeners
   */
  public cleanup(): void {
    // We don't remove the global listeners as they might be used by other instances
    console.log('INPUT SYSTEM: Cleaned up');
  }

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
      console.warn('INPUT SYSTEM UPDATE: No entities with input components found');
      return; // No entities to process
    }
    
    console.log(`INPUT SYSTEM UPDATE: Processing ${entities.length} entities`);
    
    // Log the current global key state for debugging
    const activeKeys = Object.keys(InputSystem.globalKeyState).filter(key => 
      InputSystem.globalKeyState[key]);
    
    if (activeKeys.length > 0) {
      console.warn(`ACTIVE KEYS: ${activeKeys.join(', ')}`);
    }
    
    for (const entity of entities) {
      console.log(`INPUT SYSTEM: Processing entity ${entity.getId()}`);
      
      // Get input component
      const input = entity.getComponent<InputComponent>(ComponentTypes.INPUT);
      if (!input) {
        console.warn(`INPUT SYSTEM: Entity ${entity.getId()} missing INPUT component`);
        continue;
      }

      // Get velocity component
      const velocity = entity.getComponent<VelocityComponent>(ComponentTypes.VELOCITY);
      if (!velocity) {
        console.warn(`INPUT SYSTEM: Entity ${entity.getId()} missing VELOCITY component`);
        continue;
      }

      // Update input component based on global key state
      input.up = InputSystem.globalKeyState['w'] || 
                 InputSystem.globalKeyState['arrowup'] || false;
      
      input.down = InputSystem.globalKeyState['s'] || 
                   InputSystem.globalKeyState['arrowdown'] || false;
      
      input.left = InputSystem.globalKeyState['a'] || 
                   InputSystem.globalKeyState['arrowleft'] || false;
      
      input.right = InputSystem.globalKeyState['d'] || 
                    InputSystem.globalKeyState['arrowright'] || false;

      // Log current input state
      console.log(`INPUT STATE: up=${input.up}, down=${input.down}, left=${input.left}, right=${input.right}`);

      // If any keys are active, log with high visibility
      if (input.up || input.down || input.left || input.right) {
        console.warn(`👁️ ACTIVE INPUT: up=${input.up}, down=${input.down}, left=${input.left}, right=${input.right}`);
      }

      // Calculate direction from input
      const [directionX, directionY] = getInputDirection(input);
      
      // Only update velocity if direction changed or if there's any direction
      if (directionX !== 0 || directionY !== 0) {
        setVelocityDirection(velocity, directionX, directionY);
        console.warn(`VELOCITY SET: direction=(${directionX.toFixed(2)}, ${directionY.toFixed(2)}), speed=${velocity.speed}`);
      }
    }
  }
} 