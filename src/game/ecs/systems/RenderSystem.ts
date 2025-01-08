import { BaseSystem } from '../core/System';
import { Entity } from '../core/Entity';
import { ComponentTypes } from '../core/Component';
import { TransformComponent } from '../components/TransformComponent';
import { RenderComponent } from '../components/RenderComponent';
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
 * RenderSystem - Prepares entities for rendering with React-Konva
 * This system doesn't actually render anything, but collects render data
 * that can be used by React components
 */
export class RenderSystem extends BaseSystem {
  private renderData: RenderData[] = [];

  constructor() {
    // This system requires TransformComponent and RenderComponent
    super([ComponentTypes.TRANSFORM, ComponentTypes.RENDER], 100); // High priority (runs toward the end)
  }

  /**
   * Update render data for entities
   */
  public update(entities: Entity[], deltaTime: number): void {
    // Clear previous render data
    this.renderData = [];

    // Sort entities by z-index
    const sortedEntities = [...entities].sort((a, b) => {
      const renderA = a.getComponent<RenderComponent>(ComponentTypes.RENDER);
      const renderB = b.getComponent<RenderComponent>(ComponentTypes.RENDER);
      return (renderA?.zIndex || 0) - (renderB?.zIndex || 0);
    });

    // Process entities and collect render data
    for (const entity of sortedEntities) {
      const transform = entity.getComponent<TransformComponent>(ComponentTypes.TRANSFORM);
      const render = entity.getComponent<RenderComponent>(ComponentTypes.RENDER);
      const tag = entity.getComponent<TagComponent>(ComponentTypes.TAG);
      
      if (!transform || !render || !tag || !render.visible) continue;

      // Create base render data
      const data: RenderData = {
        id: entity.getId(),
        x: transform.x,
        y: transform.y,
        width: transform.width,
        height: transform.height,
        renderType: render.renderType,
        zIndex: render.zIndex,
        visible: render.visible,
        color: render.color,
        opacity: render.opacity,
        tag: tag.tag
      };

      // Add optional health data if available
      const health = entity.getComponent<HealthComponent>(ComponentTypes.HEALTH);
      if (health) {
        data.health = {
          current: health.currentHealth,
          max: health.maxHealth
        };
      }

      // Add to render list
      this.renderData.push(data);
    }
  }

  /**
   * Get render data for a specific render type
   */
  public getRenderDataByType(renderType: string): RenderData[] {
    return this.renderData.filter(data => data.renderType === renderType);
  }

  /**
   * Get all render data
   */
  public getAllRenderData(): RenderData[] {
    return this.renderData;
  }
} 