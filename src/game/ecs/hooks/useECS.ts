import { useState, useEffect, useRef, useCallback } from 'react';
import { World } from '../core/World';
import { 
  InputSystem, 
  MovementSystem, 
  RenderSystem, 
  CategorizedRenderData,
  AISystem,
  CollisionSystem,
  ProjectileSystem,
  ScoreSystem,
  GameStateSystem,
  PlayerSystem,
  SpawnSystem
} from '../systems';
import {
  MAX_DELTA_TIME,
  TIME_SCALE
} from '../../constants';

// Define a type for the systems reference
type SystemsRef = {
  input: InputSystem | null;
  movement: MovementSystem | null;
  render: RenderSystem | null;
  ai: AISystem | null;
  collision: CollisionSystem | null;
  projectile: ProjectileSystem | null;
  score: ScoreSystem | null;
  gameState: GameStateSystem | null;
  player: PlayerSystem | null;
  spawn: SpawnSystem | null;
};

/**
 * Custom hook for integrating the ECS with React components
 */
export const useECS = (isPaused: boolean = false) => {
  // Create world and systems
  const worldRef = useRef<World | null>(null);
  const systemsRef = useRef<SystemsRef>({
    input: null,
    movement: null,
    render: null,
    ai: null,
    collision: null,
    projectile: null,
    score: null,
    gameState: null,
    player: null,
    spawn: null
  });
  
  // Time accumulation for fixed time step - but using simpler approach for now
  const lastTimeRef = useRef<number>(0);
  
  // State to track render data - use a ref for performance
  const renderDataRef = useRef<CategorizedRenderData>({
    players: [],
    enemies: [],
    projectiles: [],
    other: []
  });
  
  // Actual state for React rendering - updated less frequently
  const [categorizedRenderData, setCategorizedRenderData] = useState<CategorizedRenderData>(renderDataRef.current);
  
  // State to track if systems are initialized
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Track the last time we updated the UI (for throttling)
  const lastRenderTimeRef = useRef<number>(0);
  
  // Track the actual FPS
  const fpsRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsUpdateTimeRef = useRef<number>(0);
  
  // Game state
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // Set up the ECS world and systems
  useEffect(() => {
    // Only initialize once
    if (isInitialized) return;
    
    console.log('Initializing ECS systems');
    
    // Create a new world
    const world = new World();
    worldRef.current = world;
    
    // Create and add systems
    const inputSystem = new InputSystem();
    const movementSystem = new MovementSystem();
    const renderSystem = new RenderSystem();
    const aiSystem = new AISystem();
    const collisionSystem = new CollisionSystem();
    const projectileSystem = new ProjectileSystem();
    const scoreSystem = new ScoreSystem();
    const gameStateSystem = new GameStateSystem();
    const playerSystem = new PlayerSystem();
    const spawnSystem = new SpawnSystem();
    
    // Add systems to the world in priority order
    world.addSystem(gameStateSystem);
    world.addSystem(scoreSystem);
    world.addSystem(playerSystem);
    world.addSystem(inputSystem);
    world.addSystem(movementSystem);
    world.addSystem(aiSystem);
    world.addSystem(spawnSystem);
    world.addSystem(projectileSystem);
    world.addSystem(collisionSystem);
    world.addSystem(renderSystem);
    
    // Store systems in ref
    systemsRef.current = {
      input: inputSystem,
      movement: movementSystem,
      render: renderSystem,
      ai: aiSystem,
      collision: collisionSystem,
      projectile: projectileSystem,
      score: scoreSystem,
      gameState: gameStateSystem,
      player: playerSystem,
      spawn: spawnSystem
    };
    
    // Initialize all systems
    Object.values(systemsRef.current).forEach(system => {
      if (system) {
        system.initialize();
      }
    });
    
    // Reset time trackers
    lastTimeRef.current = performance.now();
    lastRenderTimeRef.current = performance.now();
    lastFpsUpdateTimeRef.current = performance.now();
    frameCountRef.current = 0;
    
    // Mark as initialized
    setIsInitialized(true);
    console.log('ECS systems initialized');
    
    // Cleanup function
    return () => {
      // Clean up all systems
      Object.values(systemsRef.current).forEach(system => {
        if (system) {
          system.cleanup();
        }
      });
      
      // Reset the world
      if (worldRef.current) {
        worldRef.current.reset();
      }
    };
  }, [isInitialized]);
  
  // Memoized state update function for better performance
  const updateGameState = useCallback(() => {
    if (!systemsRef.current.score || !systemsRef.current.gameState) {
      return;
    }
    
    // Only update state if there's a change to reduce React renders
    const currentScore = systemsRef.current.score.getScore();
    if (currentScore !== score) {
      setScore(currentScore);
    }
    
    const currentGameOver = systemsRef.current.gameState.isGameOver();
    if (currentGameOver !== isGameOver) {
      setIsGameOver(currentGameOver);
    }
    
    const currentShowLevelUp = systemsRef.current.gameState.isShowingLevelUp();
    if (currentShowLevelUp !== showLevelUp) {
      setShowLevelUp(currentShowLevelUp);
    }
  }, [score, isGameOver, showLevelUp]);
  
  // Calculate and update FPS - simplified for reliability
  const updateFPS = useCallback((currentTime: number) => {
    frameCountRef.current += 1;
    const elapsed = currentTime - lastFpsUpdateTimeRef.current;
    
    // Update FPS counter once per second
    if (elapsed >= 1000) {
      const newFps = Math.round((frameCountRef.current * 1000) / elapsed);
      fpsRef.current = newFps;
      lastFpsUpdateTimeRef.current = currentTime;
      frameCountRef.current = 0;
      
      // Log FPS for debugging
      console.log(`FPS: ${newFps}`);
    }
  }, []);
  
  // Update the world each frame - using simplified time step for reliability
  useEffect(() => {
    if (!isInitialized || !worldRef.current) return;
    
    console.log('Starting game loop');
    
    // Set pause state via GameStateSystem
    if (systemsRef.current.gameState) {
      systemsRef.current.gameState.setPaused(isPaused);
    }
    
    let frameId: number;
    
    // Simplified game loop function - easier to debug
    const gameLoop = () => {
      const currentTime = performance.now();
      
      // Calculate actual delta time since last frame
      const deltaTimeMs = currentTime - lastTimeRef.current;
      const deltaTime = Math.min(deltaTimeMs / 1000, MAX_DELTA_TIME); // Convert to seconds and cap
      
      // Update FPS counter
      updateFPS(currentTime);
      
      // Update the game world with the current delta time
      if (!isPaused && worldRef.current) {
        try {
          // Directly update with current delta time - simpler approach
          worldRef.current.update(deltaTime * TIME_SCALE);
        } catch (error) {
          console.error('Error in game loop update:', error);
        }
      }
      
      // Update render data at a throttled rate for better performance
      if (currentTime - lastRenderTimeRef.current > 50) { // update UI at ~20fps
        if (systemsRef.current.render) {
          try {
            // Get render data and update React state
            renderDataRef.current = systemsRef.current.render.getCategorizedRenderData();
            setCategorizedRenderData({...renderDataRef.current});
            
            // Update game state for UI
            updateGameState();
          } catch (error) {
            console.error('Error in render update:', error);
          }
          
          // Update timestamp
          lastRenderTimeRef.current = currentTime;
        }
      }
      
      // Save current time for next frame's delta calculation
      lastTimeRef.current = currentTime;
      
      // Request next frame
      frameId = requestAnimationFrame(gameLoop);
    };
    
    // Start the game loop
    lastTimeRef.current = performance.now(); // Initialize time
    frameId = requestAnimationFrame(gameLoop);
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isInitialized, isPaused, updateGameState, updateFPS]);
  
  // Provide world, render data, and game state to consumers
  return {
    world: worldRef.current,
    categorizedRenderData,
    score,
    isGameOver,
    showLevelUp,
    isInitialized,
    fps: fpsRef.current
  };
}; 