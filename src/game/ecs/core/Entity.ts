/**
 * Entity class - represents a unique game object in the ECS architecture
 * An entity is essentially just an ID with associated components
 */

// Counter for generating unique entity IDs
let nextEntityId = 1;

export class Entity {
  private id: number;
  private components: Map<string, any> = new Map();

  constructor() {
    this.id = nextEntityId++;
  }

  /**
   * Get the entity's unique ID
   */
  public getId(): number {
    return this.id;
  }

  /**
   * Add a component to this entity
   * @param componentType The type/key of the component
   * @param component The component instance
   */
  public addComponent<T>(componentType: string, component: T): this {
    this.components.set(componentType, component);
    return this;
  }

  /**
   * Remove a component from this entity
   * @param componentType The type/key of the component to remove
   */
  public removeComponent(componentType: string): this {
    this.components.delete(componentType);
    return this;
  }

  /**
   * Remove all components from this entity
   * Used when recycling entities in the object pool
   */
  public removeAllComponents(): this {
    this.components.clear();
    return this;
  }

  /**
   * Check if the entity has a specific component
   * @param componentType The type/key of the component to check
   */
  public hasComponent(componentType: string): boolean {
    return this.components.has(componentType);
  }

  /**
   * Get a component from this entity
   * @param componentType The type/key of the component to get
   */
  public getComponent<T>(componentType: string): T | undefined {
    return this.components.get(componentType) as T;
  }

  /**
   * Reset entity ID counter - typically used for testing or game reset
   */
  public static resetIdCounter(): void {
    nextEntityId = 1;
  }
} 