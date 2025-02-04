import { BaseSystem } from '../core/System';
import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { TransformComponent } from '../components/TransformComponent';
import { RenderComponent, RenderType } from '../components/RenderComponent';
import { TagComponent } from '../components/TagComponent';
import { HealthComponent } from '../components/HealthComponent';

/**
 * RenderData interface - Represents data needed to render an entity
 */
export interface RenderData {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  renderType: string;
  zIndex: number;
  visible: boolean;
  color?: string;
  opacity?: number;
  tag: string;
  health?: {
    current: number;
    max: number;
  };
}

/**
 * Categorized render data by entity type
 */
export interface CategorizedRenderData {
  players: RenderData[];
  enemies: RenderData[];
  projectiles: RenderData[];
  other: RenderData[];
}

/**
 * Simple object pool for RenderData objects to reduce allocations
 */
class RenderDataPool {
  private pool: RenderData[] = [];
  private maxSize: number;
  
  constructor(initialSize: number = 100, maxSize: number = 1000) {
    this.maxSize = maxSize;
    
    // Initialize pool with objects
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createNewRenderData());
    }
  }
  
  /**
   * Create a new render data object
   */
  private createNewRenderData(): RenderData {
    return {
      id: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0, 
      renderType: '',
      zIndex: 0,
      visible: true,
      tag: ''
    };
  }
  
  /**
   * Get an object from the pool or create a new one
   */
  public acquire(): RenderData {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    
    // Create new object if pool is empty
    return this.createNewRenderData();
  }
  
  /**
   * Return an object to the pool
   */
  public release(renderData: RenderData): void {
    // Only add to pool if under maximum size
    if (this.pool.length < this.maxSize) {
      // Clear any references
      renderData.health = undefined;
      this.pool.push(renderData);
    }
    // Otherwise let GC collect it
  }
  
  /**
   * Release all render data from an array
   */
  public releaseAll(renderDataArray: RenderData[]): void {
    for (const data of renderDataArray) {
      this.release(data);
    }
    renderDataArray.length = 0; // Clear the array
  }
}

/**
 * RenderSystem - Prepares entities for rendering with React-Konva
 * This system doesn't actually render anything, but collects render data
 * that can be used by React components
 */
export class RenderSystem extends BaseSystem {
  private renderDataPool: RenderDataPool;
  private renderData: RenderData[] = [];
  
  // Pre-allocated arrays for categorized data to avoid creating new arrays each frame
  private playerRenderData: RenderData[] = [];
  private enemyRenderData: RenderData[] = [];
  private projectileRenderData: RenderData[] = [];
  private otherRenderData: RenderData[] = [];
  
  // Cached categorized render data to avoid creating new objects each frame
  private cachedCategorizedRenderData: CategorizedRenderData;

  constructor() {
    // This system requires TransformComponent and RenderComponent
    super([ComponentTypes.TRANSFORM, ComponentTypes.RENDER], 100); // High priority (runs toward the end)
    
    // Initialize the render data pool
    this.renderDataPool = new RenderDataPool();
    
    // Initialize cached categorized render data
    this.cachedCategorizedRenderData = {
      players: this.playerRenderData,
      enemies: this.enemyRenderData,
      projectiles: this.projectileRenderData,
      other: this.otherRenderData
    };
  }

  /**
   * Initialize the render system
   */
  public initialize(): void {
    // Clear any existing render data
    this.clearRenderData();
  }
  
  /**
   * Clean up the render system
   */
  public cleanup(): void {
    // Return all render data to the pool
    this.clearRenderData();
  }
  
  /**
   * Clear all render data and return objects to the pool
   */
  private clearRenderData(): void {
    // Return all render data to pool
    this.renderDataPool.releaseAll(this.renderData);
    
    // Clear categorized arrays
    this.playerRenderData.length = 0;
    this.enemyRenderData.length = 0;
    this.projectileRenderData.length = 0;
    this.otherRenderData.length = 0;
  }

  /**
   * Update render data for entities
   */
  public update(entities: Entity[], _deltaTime: number): void {
    // Clear previous render data and return objects to pool
    this.clearRenderData();

    // Sort entities by z-index
    entities.sort((a, b) => {
      const renderA = a.getComponent<RenderComponent>(ComponentTypes.RENDER);
      const renderB = b.getComponent<RenderComponent>(ComponentTypes.RENDER);
      return (renderA?.zIndex || 0) - (renderB?.zIndex || 0);
    });
    const sortedEntities = entities;

    // Process entities and collect render data
    for (const entity of sortedEntities) {
      const transform = entity.getComponent<TransformComponent>(ComponentTypes.TRANSFORM);
      const render = entity.getComponent<RenderComponent>(ComponentTypes.RENDER);
      
      if (!transform || !render || !render.visible) {
        continue; // Skip entities that can't be rendered
      }
      
      // Get the entity's tag if available
      const tag = entity.getComponent<TagComponent>(ComponentTypes.TAG);
      if (!tag) {
        continue; // Skip entities without tags
      }

      // Get a render data object from the pool
      const data = this.renderDataPool.acquire();
      
      // Populate with entity data
      data.id = entity.getId();
      data.x = transform.x;
      data.y = transform.y;
      data.width = transform.width;
      data.height = transform.height;
      data.renderType = render.renderType;
      data.zIndex = render.zIndex;
      data.visible = render.visible;
      data.color = render.color;
      data.opacity = render.opacity;
      data.tag = tag.tag;

      // Add optional health data if available
      const health = entity.getComponent<HealthComponent>(ComponentTypes.HEALTH);
      if (health) {
        if (!data.health) {
          data.health = { current: 0, max: 0 };
        }
        data.health.current = health.currentHealth;
        data.health.max = health.maxHealth;
      } else {
        data.health = undefined;
      }

      // Add to render list
      this.renderData.push(data);
      
      // Add to appropriate categorized list
      if (data.renderType === RenderType.PLAYER) {
        this.playerRenderData.push(data);
      } else if (data.renderType === RenderType.ENEMY) {
        this.enemyRenderData.push(data);
      } else if (data.renderType === RenderType.PROJECTILE) {
        this.projectileRenderData.push(data);
      } else {
        this.otherRenderData.push(data);
      }
    }
  }

  /**
   * Get render data for a specific render type
   */
  public getRenderDataByType(renderType: string): RenderData[] {
    // Return pre-categorized arrays when possible
    if (renderType === RenderType.PLAYER) return this.playerRenderData;
    if (renderType === RenderType.ENEMY) return this.enemyRenderData;
    if (renderType === RenderType.PROJECTILE) return this.projectileRenderData;
    
    // For other types, we need to filter
    return this.renderData.filter(data => data.renderType === renderType);
  }

  /**
   * Get all render data
   */
  public getAllRenderData(): RenderData[] {
    return this.renderData;
  }
  
  /**
   * Get categorized render data for more efficient React rendering
   * This avoids multiple filtering operations in the React components
   */
  public getCategorizedRenderData(): CategorizedRenderData {
    // Return cached object with pre-populated arrays
    return this.cachedCategorizedRenderData;
  }
} 