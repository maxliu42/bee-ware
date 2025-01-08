import { Component, ComponentTypes } from '../core/Component';

/**
 * TransformComponent - Represents the position and size of an entity
 */
export interface TransformComponent extends Component {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Create a new TransformComponent
 */
export function createTransformComponent(
  x: number, 
  y: number, 
  width: number, 
  height: number
): TransformComponent {
  return {
    type: ComponentTypes.TRANSFORM,
    x,
    y,
    width,
    height
  };
}

/**
 * Get the center position of a transform
 */
export function getTransformCenter(transform: TransformComponent): { x: number, y: number } {
  return {
    x: transform.x + transform.width / 2,
    y: transform.y + transform.height / 2
  };
} 