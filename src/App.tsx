import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';
import ECSGame from './components/ECSGame';
import headerImage from './assets/images/beeware-header.png';
import borderImage from './assets/images/beeware-border.png';
import BackgroundEffects from './components/background/BackgroundEffects';
import './components/background/OrbAnimations.css';

const App: React.FC = () => {
  // State to toggle between original and ECS implementations
  const [useECS, setUseECS] = useState(false);
  
  // Handler for checkbox change
  const handleToggleECS = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseECS(e.target.checked);
    console.log("ECS toggle changed to:", e.target.checked); // For debugging
  };
  
  return (
    <div className="App">
      {/* Background effects rendered as React components */}
      <BackgroundEffects />
      
      <main>
        <div className="game-border-container">
          <img 
            src={borderImage} 
            alt="Game Border" 
            className="game-border"
          />
          <div className="game-header">
            <img 
              src={headerImage} 
              alt="Bee-Ware" 
              className="header-image"
            />
            <div className="ecs-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={useECS}
                  onChange={handleToggleECS}
                />
                Use ECS Version
              </label>
            </div>
          </div>
          <div className="game-container">
            {useECS ? <ECSGame /> : <Game />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
