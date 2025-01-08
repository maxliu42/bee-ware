import { Component, ComponentTypes } from '../core/Component';

/**
 * Render types supported by the game
 */
export enum RenderType {
  PLAYER = 'player',
  ENEMY = 'enemy',
  PROJECTILE = 'projectile',
  HEALTH_BAR = 'healthBar'
}

/**
 * RenderComponent - Contains information needed to render an entity
 */
export interface RenderComponent extends Component {
  renderType: RenderType;
  zIndex: number; // Rendering order (higher values render on top)
  visible: boolean;
  color?: string; // Optional color override
  opacity?: number; // Optional opacity setting
}

/**
 * Create a new RenderComponent
 */
export function createRenderComponent(
  renderType: RenderType,
  zIndex: number = 0,
  visible: boolean = true,
  color?: string,
  opacity?: number
): RenderComponent {
  return {
    type: ComponentTypes.RENDER,
    renderType,
    zIndex,
    visible,
    color,
    opacity
  };
} 