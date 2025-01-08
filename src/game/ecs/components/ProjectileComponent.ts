import { Component, ComponentTypes } from '../core/Component';

/**
 * ProjectileComponent - Contains information specific to projectiles
 */
export interface ProjectileComponent extends Component {
  damage: number;
  pierceLeft: number; // Number of enemies the projectile can pierce
  ownerEntityId: number; // ID of the entity that fired the projectile
}

/**
 * Create a new ProjectileComponent
 */
export function createProjectileComponent(
  damage: number,
  pierceLeft: number = 1,
  ownerEntityId: number
): ProjectileComponent {
  return {
    type: ComponentTypes.PROJECTILE,
    damage,
    pierceLeft,
    ownerEntityId
  };
}

/**
 * Reduce the pierce count when a projectile hits something
 * @returns true if the projectile is used up (no more pierce left)
 */
export function decrementPierce(projectile: ProjectileComponent): boolean {
  projectile.pierceLeft -= 1;
  return projectile.pierceLeft <= 0;
} 