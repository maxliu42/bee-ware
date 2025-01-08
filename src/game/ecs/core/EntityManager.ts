import { Entity } from './Entity';
import { ComponentType } from './Component';

/**
 * EntityManager - Manages the creation, tracking, and destruction of entities
 * Provides methods to query entities with specific components
 */
export class EntityManager {
  private entities: Map<number, Entity> = new Map();
  private entitiesToAdd: Entity[] = [];
  private entitiesToRemove: number[] = [];
  private isDeferringOperations: boolean = false;

  /**
   * Create a new entity
   */
  public createEntity(): Entity {
    const entity = new Entity();
    
    if (this.isDeferringOperations) {
      this.entitiesToAdd.push(entity);
    } else {
      this.addEntityImmediate(entity);
    }
    
    return entity;
  }

  /**
   * Add an existing entity to the manager
   */
  public addEntity(entity: Entity): void {
    if (this.isDeferringOperations) {
      this.entitiesToAdd.push(entity);
    } else {
      this.addEntityImmediate(entity);
    }
  }

  /**
   * Remove an entity by ID
   */
  public removeEntity(entityId: number): void {
    if (this.isDeferringOperations) {
      this.entitiesToRemove.push(entityId);
    } else {
      this.removeEntityImmediate(entityId);
    }
  }

  /**
   * Get an entity by ID
   */
  public getEntity(entityId: number): Entity | undefined {
    return this.entities.get(entityId);
  }

  /**
   * Get all entities currently managed
   */
  public getAllEntities(): Entity[] {
    return Array.from(this.entities.values());
  }

  /**
   * Get entities that have all the specified component types
   */
  public getEntitiesWithComponents(componentTypes: ComponentType[]): Entity[] {
    return this.getAllEntities().filter(entity => 
      componentTypes.every(type => entity.hasComponent(type))
    );
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
    this.entitiesToAdd.forEach(entity => {
      this.addEntityImmediate(entity);
    });
    this.entitiesToAdd = [];

    // Remove entities marked for removal
    this.entitiesToRemove.forEach(entityId => {
      this.removeEntityImmediate(entityId);
    });
    this.entitiesToRemove = [];

    this.isDeferringOperations = false;
  }

  /**
   * Clear all entities
   */
  public clear(): void {
    this.entities.clear();
    this.entitiesToAdd = [];
    this.entitiesToRemove = [];
  }

  /**
   * Get the count of entities
   */
  public getEntityCount(): number {
    return this.entities.size;
  }

  /**
   * Internal method to add an entity immediately
   */
  private addEntityImmediate(entity: Entity): void {
    this.entities.set(entity.getId(), entity);
  }

  /**
   * Internal method to remove an entity immediately
   */
  private removeEntityImmediate(entityId: number): void {
    this.entities.delete(entityId);
  }
} 