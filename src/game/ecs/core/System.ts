import { Entity } from './Entity';
import { ComponentType } from './Component';
import { World } from './World';

/**
 * System interface - represents a system that processes entities with specific components
 */
export interface System {
  /**
   * Initialize the system
   * @param world The world instance this system belongs to
   */
  init(world: World): void;
  
  initialize(): void;
  
  cleanup(): void;
  
  /**
   * Update method called each frame
   * @param entities The entities to process
   * @param deltaTime Time elapsed since the last update in seconds
   */
  update(entities: Entity[], deltaTime: number): void;
  
  /**
   * Get the component types this system requires
   */
  getRequiredComponents(): ComponentType[];
  
  /**
   * Get system priority (lower numbers run first)
   */
  getPriority(): number;
}

/**
 * Abstract base class for systems
 */
export abstract class BaseSystem implements System {
  protected world: World | null = null;
  private readonly requiredComponents: ComponentType[];
  private readonly priority: number;

  /**
   * Create a new system
   * @param requiredComponents The component types this system requires
   * @param priority The priority of this system (lower numbers run first)
   */
  constructor(requiredComponents: ComponentType[], priority: number = 0) {
    this.requiredComponents = requiredComponents;
    this.priority = priority;
  }

  /**
   * Initialize the system with a world reference
   */
  public init(world: World): void {
    this.world = world;
  }
  
  /**
   * Default initialize implementation
   * Systems should override this if they need to initialize resources
   */
  public initialize(): void {
    // Default implementation does nothing
  }
  
  /**
   * Default cleanup implementation
   * Systems should override this if they need to clean up resources
   */
  public cleanup(): void {
    // Default implementation does nothing
  }

  /**
   * Abstract update method to be implemented by derived systems
   */
  public abstract update(entities: Entity[], deltaTime: number): void;
  
  /**
   * Get the component types this system requires
   */
  public getRequiredComponents(): ComponentType[] {
    return this.requiredComponents;
  }
  
  /**
   * Get system priority (lower numbers run first)
   */
  public getPriority(): number {
    return this.priority;
  }
} 