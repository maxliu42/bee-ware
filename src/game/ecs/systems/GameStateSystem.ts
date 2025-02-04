import { Entity } from '../core/Entity';
import { BaseSystem } from '../core/System';
import {
  GAME_STATE_COMPONENT,
  GameStateComponent,
  createGameStateComponent,
  setPaused,
  setGameOver,
  setShowLevelUp,
  levelUp
} from '../components/GameStateComponent';
import { World } from '../core/World';

/**
 * System for managing the game state
 */
export class GameStateSystem extends BaseSystem {
  private gameStateEntity: Entity | null = null;
  
  constructor() {
    // This system requires the game state component
    super([GAME_STATE_COMPONENT], -200); // Very high priority
  }
  
  /**
   * Initialize the system with a world reference
   */
  public init(world: World): void {
    super.init(world);
    
    // Create a singleton entity to hold game state
    this.gameStateEntity = world.createEntity();
    this.gameStateEntity.addComponent(GAME_STATE_COMPONENT, createGameStateComponent());
  }
  
  /**
   * Initialize the game state system
   */
  public initialize(): void {
    // Already initialized in init
  }
  
  /**
   * Clean up the game state system
   */
  public cleanup(): void {
    // Nothing to clean up
  }
  
  /**
   * Update method - not actively used as game state changes are event-driven
   */
  public update(entities: Entity[], _deltaTime: number): void {
    // The game state entity should be the only entity with the game state component
    if (entities.length > 0) {
      this.gameStateEntity = entities[0];
    }
  }
  
  /**
   * Get the game state component
   */
  private getGameStateComponent(): GameStateComponent | undefined {
    return this.gameStateEntity?.getComponent<GameStateComponent>(GAME_STATE_COMPONENT);
  }
  
  /**
   * Set the paused state
   */
  public setPaused(isPaused: boolean): void {
    const gameState = this.getGameStateComponent();
    if (gameState) {
      setPaused(gameState, isPaused);
      
      // Update the world pause state to match
      if (this.world) {
        this.world.setPaused(gameState.isPaused);
      }
    }
  }
  
  /**
   * Check if the game is paused
   */
  public isPaused(): boolean {
    return this.getGameStateComponent()?.isPaused || false;
  }
  
  /**
   * Set the game over state
   */
  public setGameOver(isGameOver: boolean): void {
    const gameState = this.getGameStateComponent();
    if (gameState) {
      setGameOver(gameState, isGameOver);
      
      // Update the world pause state to match
      if (this.world) {
        this.world.setPaused(gameState.isPaused);
      }
    }
  }
  
  /**
   * Check if the game is over
   */
  public isGameOver(): boolean {
    return this.getGameStateComponent()?.isGameOver || false;
  }
  
  /**
   * Set the level up state
   */
  public setShowLevelUp(showLevelUp: boolean): void {
    const gameState = this.getGameStateComponent();
    if (gameState) {
      setShowLevelUp(gameState, showLevelUp);
      
      // Update the world pause state to match
      if (this.world) {
        this.world.setPaused(gameState.isPaused);
      }
    }
  }
  
  /**
   * Check if the level up screen should be shown
   */
  public isShowingLevelUp(): boolean {
    return this.getGameStateComponent()?.showLevelUp || false;
  }
  
  /**
   * Level up the game
   */
  public levelUp(): void {
    const gameState = this.getGameStateComponent();
    if (gameState) {
      levelUp(gameState);
      
      // Update the world pause state to match
      if (this.world) {
        this.world.setPaused(gameState.isPaused);
      }
    }
  }
  
  /**
   * Get the current level
   */
  public getCurrentLevel(): number {
    return this.getGameStateComponent()?.currentLevel || 1;
  }
  
  /**
   * Reset the game state
   */
  public resetGameState(): void {
    const gameState = this.getGameStateComponent();
    if (gameState) {
      gameState.isPaused = false;
      gameState.isGameOver = false;
      gameState.showLevelUp = false;
      gameState.currentLevel = 1;
      
      // Update the world pause state to match
      if (this.world) {
        this.world.setPaused(false);
      }
    }
  }
} 