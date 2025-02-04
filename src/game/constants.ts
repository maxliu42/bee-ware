/**
 * Game constants and configuration
 */

// Stage dimensions
export const STAGE_WIDTH: number = 1024;
export const STAGE_HEIGHT: number = 768;

// Player settings
export const PLAYER_SPEED: number = 1;
export const PLAYER_INITIAL_HEALTH: number = 100;
export const PLAYER_SIZE: number = 32;

// Enemy settings
export const ENEMY_SPEED: number = 2;
export const ENEMY_INITIAL_HEALTH: number = 10;
export const ENEMY_SIZE: number = 32;

// Weapon settings
export const PROJECTILE_SPEED: number = 8;
export const PROJECTILE_DAMAGE: number = 5;
export const PROJECTILE_SIZE: number = 8;
export const ATTACK_RATE: number = 500;
export const DEFAULT_PIERCE: number = 1;

// Canvas positioning
export const PLAYER_X: number = STAGE_WIDTH / 2 - PLAYER_SIZE / 2;
export const PLAYER_Y: number = STAGE_HEIGHT / 2 - PLAYER_SIZE / 2;

// UI settings
export const HEALTH_BAR_HEIGHT: number = 5;

// Spawn system settings
export const MAX_ENEMIES: number = 20;
export const INITIAL_SPAWN_DELAY: number = 1.0;
export const BASE_SPAWN_INTERVAL: number = 3.0;
export const MIN_SPAWN_INTERVAL: number = 1.0;
export const SPAWN_RATE_PROGRESSION: number = 30; // Lower = faster progression

// Game timing/performance settings
export const FIXED_DELTA_TIME: number = 1/60; // Fixed time step (60 updates per second)
export const MAX_DELTA_TIME: number = 0.1; // Maximum allowed delta time (100ms)
export const TIME_SCALE: number = 1.0; // Default time scale (1.0 = normal speed) 