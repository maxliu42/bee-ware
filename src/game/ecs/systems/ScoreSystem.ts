import { Entity } from '../core/Entity';
import { BaseSystem } from '../core/System';
import { ComponentType } from '../core/Component';

/**
 * System for managing the game score.
 * This system doesn't require any components since it's a global game state.
 */
export class ScoreSystem extends BaseSystem {
  private score: number = 0;
  private highScore: number = 0;
  
  constructor() {
    // This system doesn't require any components
    super([], -100); // High priority (runs early)
  }
  
  /**
   * Initialize the score system
   */
  public initialize(): void {
    this.resetScore();
  }
  
  /**
   * Clean up the score system
   */
  public cleanup(): void {
    // Nothing to clean up
  }
  
  /**
   * Update method - not used in this system as score changes are event-driven
   */
  public update(_entities: Entity[], _deltaTime: number): void {
    // Score is updated directly through incrementScore, not in the update loop
  }
  
  /**
   * Increment the score by the specified amount
   * @param amount The amount to increment the score by (default: 1)
   */
  public incrementScore(amount: number = 1): void {
    this.score += amount;
    
    // Update high score if current score is higher
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }
  
  /**
   * Get the current score
   */
  public getScore(): number {
    return this.score;
  }
  
  /**
   * Get the high score
   */
  public getHighScore(): number {
    return this.highScore;
  }
  
  /**
   * Reset the score to zero
   */
  public resetScore(): void {
    this.score = 0;
  }
} 