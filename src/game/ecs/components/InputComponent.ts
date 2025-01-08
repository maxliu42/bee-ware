import { Component, ComponentTypes } from '../core/Component';

/**
 * InputComponent - Stores information about player input
 */
export interface InputComponent extends Component {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  // Could add more inputs like shoot, etc.
}

/**
 * Create a new InputComponent
 */
export function createInputComponent(): InputComponent {
  return {
    type: ComponentTypes.INPUT,
    up: false,
    down: false,
    left: false,
    right: false
  };
}

/**
 * Reset all input states to false
 */
export function resetInput(input: InputComponent): void {
  input.up = false;
  input.down = false;
  input.left = false;
  input.right = false;
}

/**
 * Calculate movement direction from input state
 * @returns [directionX, directionY]
 */
export function getInputDirection(input: InputComponent): [number, number] {
  let directionX = 0;
  let directionY = 0;
  
  if (input.up) directionY -= 1;
  if (input.down) directionY += 1;
  if (input.left) directionX -= 1;
  if (input.right) directionX += 1;
  
  // If there's diagonal movement, normalize the vector
  if (directionX !== 0 && directionY !== 0) {
    const length = Math.sqrt(directionX * directionX + directionY * directionY);
    directionX /= length;
    directionY /= length;
  }
  
  return [directionX, directionY];
} 