
import React from 'react';
import GameScreen from './components/GameScreen';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black bg-opacity-30 flex flex-col items-center justify-center p-4">
      <GameScreen />
    </div>
  );
};

export default App;
