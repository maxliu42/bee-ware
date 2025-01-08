import { Component, ComponentTypes } from '../core/Component';

/**
 * HealthComponent - Represents the health of an entity
 */
export interface HealthComponent extends Component {
  currentHealth: number;
  maxHealth: number;
  isInvulnerable: boolean;
}

/**
 * Create a new HealthComponent
 */
export function createHealthComponent(
  maxHealth: number,
  currentHealth: number = maxHealth,
  isInvulnerable: boolean = false
): HealthComponent {
  return {
    type: ComponentTypes.HEALTH,
    currentHealth,
    maxHealth,
    isInvulnerable
  };
}

/**
 * Apply damage to a health component
 * @returns The actual amount of damage applied
 */
export function applyDamage(health: HealthComponent, amount: number): number {
  if (health.isInvulnerable || amount <= 0) {
    return 0;
  }

  const oldHealth = health.currentHealth;
  health.currentHealth = Math.max(0, health.currentHealth - amount);
  
  return oldHealth - health.currentHealth;
}

/**
 * Apply healing to a health component
 * @returns The actual amount of healing applied
 */
export function applyHealing(health: HealthComponent, amount: number): number {
  if (amount <= 0) {
    return 0;
  }

  const oldHealth = health.currentHealth;
  health.currentHealth = Math.min(health.maxHealth, health.currentHealth + amount);
  
  return health.currentHealth - oldHealth;
}

/**
 * Check if the entity is dead (health <= 0)
 */
export function isDead(health: HealthComponent): boolean {
  return health.currentHealth <= 0;
} 