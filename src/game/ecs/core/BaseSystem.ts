import { Entity } from './Entity';
import { ComponentType } from './Component';
import { World } from './World';
import { System } from './System';
import { Logger } from '../../utils/LogUtils';

/**
 * Enhanced base class for systems with common functionality
 */
export abstract class EnhancedBaseSystem implements System {
  protected world: World | null = null;
  private readonly requiredComponents: ComponentType[];
  private readonly priority: number;
  private readonly systemName: string;

  /**
   * Create a new enhanced system
   * @param systemName Name of the system for logging
   * @param requiredComponents The component types this system requires
   * @param priority The priority of this system (lower numbers run first)
   */
  constructor(systemName: string, requiredComponents: ComponentType[], priority: number = 0) {
    this.systemName = systemName;
    this.requiredComponents = requiredComponents;
    this.priority = priority;
  }

  /**
   * Initialize the system with a world reference
   */
  public init(world: World): void {
    this.world = world;
    this.log('System initialized');
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

  /**
   * Get entity with the specified tag
   */
  protected getEntityWithTag(tag: string): Entity | null {
    if (!this.world) return null;
    
    const entities = this.world.getEntitiesWithComponents(['tag']).filter(entity => {
      const tagComponent = entity.getComponent<{ tag: string }>('tag');
      return tagComponent?.tag === tag;
    });
    
    return entities.length > 0 ? entities[0] : null;
  }

  /**
   * Log debug information
   */
  protected log(message: string): void {
    Logger.log(this.systemName, message);
  }

  /**
   * Log error information
   */
  protected error(message: string): void {
    Logger.error(this.systemName, message);
  }

  /**
   * Log warning information
   */
  protected warn(message: string): void {
    Logger.warn(this.systemName, message);
  }
} 