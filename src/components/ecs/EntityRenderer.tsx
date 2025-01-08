import React from 'react';
import { Group } from 'react-konva';
import { RenderData } from '../../game/ecs/systems/RenderSystem';
import { RenderType } from '../../game/ecs/components/RenderComponent';
import PlayerRenderer from './PlayerRenderer';
import EnemyRenderer from './EnemyRenderer';
import ProjectileRenderer from './ProjectileRenderer';

interface EntityRendererProps {
  renderData: RenderData[];
}

/**
 * EntityRenderer - Renders all entities from the ECS
 */
const EntityRenderer: React.FC<EntityRendererProps> = ({ renderData }) => {
  // Filter entities by render type
  const playerEntities = renderData.filter(
    entity => entity.renderType === RenderType.PLAYER
  );
  
  const enemyEntities = renderData.filter(
    entity => entity.renderType === RenderType.ENEMY
  );
  
  const projectileEntities = renderData.filter(
    entity => entity.renderType === RenderType.PROJECTILE
  );
  
  return (
    <Group>
      {/* Render projectiles (drawn first, bottom layer) */}
      {projectileEntities.map(projectileData => (
        <ProjectileRenderer 
          key={projectileData.id} 
          projectileData={projectileData} 
        />
      ))}
      
      {/* Render enemies (middle layer) */}
      {enemyEntities.map(enemyData => (
        <EnemyRenderer 
          key={enemyData.id} 
          enemyData={enemyData} 
        />
      ))}
      
      {/* Render player entities (top layer) */}
      {playerEntities.map(playerData => (
        <PlayerRenderer 
          key={playerData.id} 
          playerData={playerData} 
        />
      ))}
    </Group>
  );
};

export default EntityRenderer; 