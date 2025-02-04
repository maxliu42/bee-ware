import { Entity } from './Entity';
import { ComponentType } from './Component';

/**
 * EntityPool - Manages a pool of recyclable entities to reduce memory allocation
 * and garbage collection overhead during gameplay.
 */
export class EntityPool {
  private availableEntities: Entity[] = [];
  private activeEntities: Map<number, Entity> = new Map();
  private maxPoolSize: number;

  /**
   * Create a new entity pool
   * @param initialSize Initial number of entities to create
   * @param maxPoolSize Maximum number of inactive entities to keep in the pool
   */
  constructor(initialSize: number = 50, maxPoolSize: number = 1000) {
    this.maxPoolSize = maxPoolSize;
    
    // Pre-populate the pool with entities
    for (let i = 0; i < initialSize; i++) {
      this.availableEntities.push(new Entity());
    }
  }

  /**
   * Get an entity from the pool, or create a new one if none are available
   */
  public acquire(): Entity {
    let entity: Entity;
    
    if (this.availableEntities.length > 0) {
      // Get an entity from the pool
      entity = this.availableEntities.pop()!;
    } else {
      // Create a new entity if the pool is empty
      entity = new Entity();
    }
    
    // Add to active entities
    this.activeEntities.set(entity.getId(), entity);
    
    return entity;
  }

  /**
   * Return an entity to the pool for reuse
   * @param entityId The ID of the entity to release
   */
  public release(entityId: number): void {
    const entity = this.activeEntities.get(entityId);
    
    if (!entity) {
      console.warn(`Attempted to release entity ${entityId} but it wasn't found in active entities`);
      return;
    }
    
    // Remove from active entities
    this.activeEntities.delete(entityId);
    
    // Clear all components from the entity
    entity.removeAllComponents();
    
    // Only add back to the pool if we're under the max size
    if (this.availableEntities.length < this.maxPoolSize) {
      this.availableEntities.push(entity);
    }
    // If we're over max size, the entity will be garbage collected
  }

  /**
   * Get all active entities
   */
  public getAllEntities(): Entity[] {
    return Array.from(this.activeEntities.values());
  }

  /**
   * Get all active entities with the specified components
   * @param componentTypes The component types to filter by
   */
  public getEntitiesWithComponents(componentTypes: ComponentType[]): Entity[] {
    return Array.from(this.activeEntities.values()).filter(entity => {
      return componentTypes.every(type => entity.hasComponent(type));
    });
  }

  /**
   * Get an entity by ID
   * @param entityId The ID of the entity to get
   */
  public getEntity(entityId: number): Entity | undefined {
    return this.activeEntities.get(entityId);
  }

  /**
   * Check if an entity is active
   * @param entityId The ID of the entity to check
   */
  public isActive(entityId: number): boolean {
    return this.activeEntities.has(entityId);
  }

  /**
   * Release all entities back to the pool
   */
  public releaseAll(): void {
    // Get all entity IDs
    const entityIds = Array.from(this.activeEntities.keys());
    
    // Release each entity
    for (const id of entityIds) {
      this.release(id);
    }
  }

  /**
   * Get the number of available entities in the pool
   */
  public getAvailableCount(): number {
    return this.availableEntities.length;
  }

  /**
   * Get the number of active entities
   */
  public getActiveCount(): number {
    return this.activeEntities.size;
  }
} 