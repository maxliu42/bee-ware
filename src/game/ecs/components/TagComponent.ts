import { Component, ComponentTypes } from '../core/Component';

/**
 * Available entity tags
 */
export enum EntityTags {
  PLAYER = 'player',
  ENEMY = 'enemy',
  PROJECTILE = 'projectile',
  SPAWNER = 'spawner'
}

/**
 * Component that adds a tag to an entity
 */
export class TagComponent implements Component {
  public readonly type = ComponentTypes.TAG;
  public tag: EntityTags;
  
  constructor(tag: EntityTags) {
    this.tag = tag;
  }
}

/**
 * Create a new TagComponent
 */
export function createTagComponent(tag: EntityTags): TagComponent {
  return new TagComponent(tag);
} 