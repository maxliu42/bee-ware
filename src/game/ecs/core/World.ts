import { Entity } from './Entity';
import { System } from './System';
import { EntityManager } from './EntityManager';
import { ComponentType } from './Component';

/**
 * World - The main container for the ECS architecture
 * Manages entities, systems, and the game loop
 */
export class World {
  private entityManager: EntityManager;
  private systems: System[] = [];
  private paused: boolean = false;

  constructor() {
    this.entityManager = new EntityManager();
  }

  /**
   * Add a system to the world
   * @param system The system to add
   */
  public addSystem(system: System): this {
    // Initialize the system with a reference to this world
    system.init(this);
    
    // Add the system to our collection
    this.systems.push(system);
    
    // Sort systems by priority
    this.systems.sort((a, b) => a.getPriority() - b.getPriority());
    
    return this;
  }

  /**
   * Create a new entity
   */
  public createEntity(): Entity {
    return this.entityManager.createEntity();
  }

  /**
   * Remove an entity
   * @param entityId The ID of the entity to remove
   */
  public removeEntity(entityId: number): void {
    this.entityManager.removeEntity(entityId);
  }

  /**
   * Get an entity by ID
   * @param entityId The ID of the entity to get
   */
  public getEntity(entityId: number): Entity | undefined {
    return this.entityManager.getEntity(entityId);
  }

  /**
   * Get all entities with the specified components
   * @param componentTypes The component types to filter by
   */
  public getEntitiesWithComponents(componentTypes: ComponentType[]): Entity[] {
    return this.entityManager.getEntitiesWithComponents(componentTypes);
  }

  /**
   * Update the world by updating all systems
   * @param deltaTime Time elapsed since the last update in seconds
   */
  public update(deltaTime: number): void {
    if (this.paused) return;

    // Begin deferred operations to avoid modifying collections during iteration
    this.entityManager.beginDeferredOperations();

    // Update each system
    for (const system of this.systems) {
      // Get entities relevant to this system
      const relevantEntities = this.entityManager.getEntitiesWithComponents(
        system.getRequiredComponents()
      );
      
      // Update the system with relevant entities
      system.update(relevantEntities, deltaTime);
    }

    // Process any entity operations that were deferred during system updates
    this.entityManager.processDeferredOperations();
  }

  /**
   * Pause or resume the world
   * @param isPaused Whether the world should be paused
   */
  public setPaused(isPaused: boolean): void {
    this.paused = isPaused;
  }

  /**
   * Check if the world is paused
   */
  public isPaused(): boolean {
    return this.paused;
  }

  /**
   * Reset the world by removing all entities
   */
  public reset(): void {
    this.entityManager.clear();
  }

  /**
   * Get the entity manager
   */
  public getEntityManager(): EntityManager {
    return this.entityManager;
  }

  /**
   * Get all systems in the world
   */
  public getSystems(): System[] {
    return [...this.systems];
  }
  
  /**
   * Get a system by its type
   * @param SystemType The constructor of the system to get
   */
  public getSystem<T extends System>(SystemType: new (...args: any[]) => T): T | undefined {
    return this.systems.find(system => system instanceof SystemType) as T | undefined;
  }
} 