import { memo } from 'react';
import { Group, Circle } from 'react-konva';
import { CategorizedRenderData, RenderData } from '../../game/ecs/systems/RenderSystem';
import PlayerRenderer from './PlayerRenderer';
import EnemyRenderer from './EnemyRenderer';
import ProjectileRenderer from './ProjectileRenderer';

interface EntityRendererProps {
  renderData: CategorizedRenderData;
}

/**
 * Generic renderer for 'other' entity types
 */
const GenericEntityRenderer = memo(({ entityData }: { entityData: RenderData }) => {
  const { x, y, width, height, color = '#ffffff' } = entityData;
  
  // Calculate center coordinates
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  return (
    <Circle
      x={centerX}
      y={centerY}
      radius={width / 2}
      fill={color || '#ffffff'}
    />
  );
});

/**
 * Memoized category renderers to prevent unnecessary re-renders
 */
const PlayersCategoryRenderer = memo(({ players }: { players: RenderData[] }) => (
  <>
    {players.map(playerData => (
      <PlayerRenderer 
        key={playerData.id} 
        playerData={playerData} 
      />
    ))}
  </>
));

const EnemiesCategoryRenderer = memo(({ enemies }: { enemies: RenderData[] }) => (
  <>
    {enemies.map(enemyData => (
      <EnemyRenderer 
        key={enemyData.id} 
        enemyData={enemyData} 
      />
    ))}
  </>
));

const ProjectilesCategoryRenderer = memo(({ projectiles }: { projectiles: RenderData[] }) => (
  <>
    {projectiles.map(projectileData => (
      <ProjectileRenderer 
        key={projectileData.id} 
        projectileData={projectileData} 
      />
    ))}
  </>
));

const OtherCategoryRenderer = memo(({ other }: { other: RenderData[] }) => (
  <>
    {other.map(entityData => (
      <GenericEntityRenderer
        key={entityData.id}
        entityData={entityData}
      />
    ))}
  </>
));

/**
 * EntityRenderer - Renders all entities from the ECS
 * Uses pre-categorized data for improved performance
 */
const EntityRenderer = memo(({ renderData }: EntityRendererProps) => {
  // Destructure the pre-categorized render data
  const { players, enemies, projectiles, other } = renderData;
  
  return (
    <Group>
      {/* Render projectiles (drawn first, bottom layer) */}
      <ProjectilesCategoryRenderer projectiles={projectiles} />
      
      {/* Render enemies (middle layer) */}
      <EnemiesCategoryRenderer enemies={enemies} />
      
      {/* Render player entities (top layer) */}
      <PlayersCategoryRenderer players={players} />
      
      {/* Render other entities */}
      <OtherCategoryRenderer other={other} />
    </Group>
  );
});

export default EntityRenderer; 