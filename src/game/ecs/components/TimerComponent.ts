import { Component, ComponentTypes } from '../core/Component';

/**
 * TimerComponent - Manages time-based events for an entity
 */
export interface TimerComponent extends Component {
  // Time remaining until the timer completes (in seconds)
  timeRemaining: number;
  
  // Maximum time for the timer (in seconds)
  duration: number;
  
  // Whether the timer should repeat after completion
  isLooping: boolean;
  
  // Whether the timer is currently active
  isActive: boolean;
}

/**
 * Create a new TimerComponent
 */
export function createTimerComponent(
  duration: number,
  isLooping: boolean = false,
  isActive: boolean = true
): TimerComponent {
  return {
    type: ComponentTypes.TIMER,
    timeRemaining: duration,
    duration,
    isLooping,
    isActive
  };
}

/**
 * Update a timer component with elapsed time
 * @returns true if the timer completed during this update
 */
export function updateTimer(timer: TimerComponent, deltaTime: number): boolean {
  if (!timer.isActive) {
    return false;
  }

  // Decrease time remaining
  timer.timeRemaining -= deltaTime;
  
  // Check if timer completed
  if (timer.timeRemaining <= 0) {
    // Handle looping timers
    if (timer.isLooping) {
      timer.timeRemaining = timer.duration + timer.timeRemaining;
    } else {
      timer.timeRemaining = 0;
      timer.isActive = false;
    }
    return true;
  }
  
  return false;
}

/**
 * Reset a timer back to its duration
 */
export function resetTimer(timer: TimerComponent, activate: boolean = true): void {
  timer.timeRemaining = timer.duration;
  timer.isActive = activate;
} 