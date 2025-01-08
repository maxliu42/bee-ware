import { useState, useEffect, useRef } from 'react';
import { World } from '../core/World';
import { EntityFactory } from '../factories/EntityFactory';
import { 
  InputSystem, 
  MovementSystem, 
  RenderSystem, 
  RenderData,
  AISystem,
  SpawnSystem,
  CollisionSystem,
  ProjectileSystem
} from '../systems';
import { ATTACK_RATE } from '../../constants';

/**
 * Custom hook for integrating the ECS with React components
 */
export const useECS = (isPaused: boolean = false) => {
  // Create world and systems
  const worldRef = useRef<World | null>(null);
  const factoryRef = useRef<EntityFactory | null>(null);
  const systemsRef = useRef({
    input: null as InputSystem | null,
    movement: null as MovementSystem | null,
    render: null as RenderSystem | null,
    ai: null as AISystem | null,
    spawn: null as SpawnSystem | null,
    collision: null as CollisionSystem | null,
    projectile: null as ProjectileSystem | null
  });
  
  // State to track render data
  const [renderData, setRenderData] = useState<RenderData[]>([]);
  
  // State to track if systems are initialized
  const [isInitialized, setIsInitialized] = useState(false);
  
  // State to track score
  const [score, setScore] = useState(0);
  
  // Set up the ECS world and systems
  useEffect(() => {
    // Only initialize once
    if (isInitialized) return;

    console.log('Initializing ECS...');
    
    // Create a new world
    const world = new World();
    worldRef.current = world;
    
    // Create entity factory
    const factory = new EntityFactory(world);
    factoryRef.current = factory;
    
    // Create and add systems
    const inputSystem = new InputSystem();
    const movementSystem = new MovementSystem();
    const renderSystem = new RenderSystem();
    const aiSystem = new AISystem();
    const collisionSystem = new CollisionSystem();
    const projectileSystem = new ProjectileSystem(factory);
    const spawnSystem = new SpawnSystem(factory);
    
    // Add systems to the world
    world.addSystem(inputSystem);
    world.addSystem(movementSystem);
    world.addSystem(aiSystem);
    world.addSystem(projectileSystem);
    world.addSystem(spawnSystem);
    world.addSystem(collisionSystem);
    world.addSystem(renderSystem);
    
    // Store systems in ref
    systemsRef.current = {
      input: inputSystem,
      movement: movementSystem,
      render: renderSystem,
      ai: aiSystem,
      spawn: spawnSystem,
      collision: collisionSystem,
      projectile: projectileSystem
    };
    
    // Initialize systems
    inputSystem.initialize();
    spawnSystem.initialize();
    
    // Create player entity
    const player = factory.createPlayer();
    
    // Add weapon timer to player
    projectileSystem.addWeaponTimer(player, ATTACK_RATE / 1000); // Convert ms to seconds
    
    // Mark as initialized
    setIsInitialized(true);
    
    // Cleanup function
    return () => {
      // Clean up systems
      if (systemsRef.current.input) {
        systemsRef.current.input.cleanup();
      }
      
      if (systemsRef.current.spawn) {
        systemsRef.current.spawn.cleanup();
      }
      
      // Reset the world
      if (worldRef.current) {
        worldRef.current.reset();
      }
    };
  }, [isInitialized]);
  
  // Update the world each frame
  useEffect(() => {
    if (!isInitialized || !worldRef.current) return;
    
    // Set pause state
    worldRef.current.setPaused(isPaused);
    
    let lastTime = performance.now();
    let frameId: number;
    
    // Game loop function
    const gameLoop = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;
      
      // Update the world
      if (worldRef.current) {
        worldRef.current.update(deltaTime);
      }
      
      // Get render data for React components
      if (systemsRef.current.render) {
        const newRenderData = systemsRef.current.render.getAllRenderData();
        setRenderData(newRenderData);
      }
      
      // Schedule next frame
      frameId = requestAnimationFrame(gameLoop);
    };
    
    // Start the game loop
    frameId = requestAnimationFrame(gameLoop);
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isInitialized, isPaused]);
  
  // Provide factory and render data to consumers
  return {
    world: worldRef.current,
    factory: factoryRef.current,
    renderData,
    score,
    isInitialized,
  };
}; 