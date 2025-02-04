import { Entity } from './Entity';
import { ComponentType } from './Component';
import { EntityPool } from './EntityPool';

/**
 * EntityManager - Manages the creation, tracking, and destruction of entities
 * Provides methods to query entities with specific components
 * Uses an EntityPool for efficient entity recycling
 */
export class EntityManager {
  private entityPool: EntityPool;
  private entitiesToAdd: Entity[] = [];
  private entitiesToRemove: number[] = [];
  private isDeferringOperations: boolean = false;

  /**
   * Create a new entity manager with an optional entity pool configuration
   */
  constructor(initialPoolSize: number = 50, maxPoolSize: number = 1000) {
    this.entityPool = new EntityPool(initialPoolSize, maxPoolSize);
  }

  /**
   * Create a new entity from the pool
   */
  public createEntity(): Entity {
    const entity = this.entityPool.acquire();
    
    if (this.isDeferringOperations) {
      this.entitiesToAdd.push(entity);
    }
    
    return entity;
  }

  /**
   * Remove an entity by ID and return it to the pool
   */
  public removeEntity(entityId: number): void {
    if (this.isDeferringOperations) {
      this.entitiesToRemove.push(entityId);
    } else {
      this.entityPool.release(entityId);
    }
  }

  /**
   * Get an entity by ID
   */
  public getEntity(entityId: number): Entity | undefined {
    return this.entityPool.getEntity(entityId);
  }

  /**
   * Get all entities currently active
   */
  public getAllEntities(): Entity[] {
    return this.entityPool.getAllEntities();
  }

  /**
   * Get entities that have all the specified component types
   */
  public getEntitiesWithComponents(componentTypes: ComponentType[]): Entity[] {
    return this.entityPool.getEntitiesWithComponents(componentTypes);
  }

  /**
   * Begin deferring entity operations
   * Used to avoid modifying collections during iteration
   */
  public beginDeferredOperations(): void {
    this.isDeferringOperations = true;
  }

  /**
   * Process all deferred entity operations
   */
  public processDeferredOperations(): void {
    // Add new entities
    this.entitiesToAdd = [];

    // Remove entities marked for removal
    this.entitiesToRemove.forEach(entityId => {
      this.entityPool.release(entityId);
    });
    this.entitiesToRemove = [];

    this.isDeferringOperations = false;
  }

  /**
   * Clear all entities
   */
  public clear(): void {
    this.entityPool.releaseAll();
    this.entitiesToAdd = [];
    this.entitiesToRemove = [];
  }

  /**
   * Get the count of active entities
   */
  public getEntityCount(): number {
    return this.entityPool.getActiveCount();
  }

  /**
   * Get the count of available entities in the pool
   */
  public getAvailableEntityCount(): number {
    return this.entityPool.getAvailableCount();
  }
} 