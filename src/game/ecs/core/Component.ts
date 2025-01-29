/**
 * Component interface - represents a piece of data that can be attached to an Entity
 * Components are pure data containers with no behavior
 */

export interface Component {
  // Base component interface - can be extended with specific component properties
  readonly type: string; // Each component must have a unique type identifier
}

/**
 * ComponentClass type - represents the constructor type for components
 */
export type ComponentClass<T extends Component = Component> = new (...args: any[]) => T;

/**
 * Component type registry - maps component names to their types
 * This allows for type-safe component access
 */
export const ComponentTypes = {
  // Core components
  TRANSFORM: 'transform',
  VELOCITY: 'velocity',
  HEALTH: 'health',
  RENDER: 'render',
  COLLIDER: 'collider',
  
  // Game-specific components
  INPUT: 'input',
  AI: 'ai',
  PROJECTILE: 'projectile',
  TAG: 'tag',
  TIMER: 'timer',
  GAME_STATE: 'gameState',
} as const;

/**
 * ComponentType type - represents the possible component type strings
 */
export type ComponentType = typeof ComponentTypes[keyof typeof ComponentTypes]; 