import { useState, useCallback } from 'react';
import InputScreen from './components/InputScreen';
import ResultsScreen from './components/ResultsScreen';

/**
 * App — root component managing the two app states.
 * Uses a single useState to toggle between 'input' and 'results' screens.
 */
function App() {
  const [screen, setScreen] = useState('input');

  const handleSubmitComplete = useCallback(() => {
    setScreen('results');
  }, []);

  const handleReset = useCallback(() => {
    setScreen('input');
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      {screen === 'input' ? (
        <InputScreen onSubmit={handleSubmitComplete} />
      ) : (
        <ResultsScreen onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
