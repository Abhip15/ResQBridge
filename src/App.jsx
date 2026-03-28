import { lazy, Suspense, useState, useCallback } from 'react';
import InputScreen from './components/InputScreen';
import { useEmergencyAnalysis } from './hooks/useEmergencyAnalysis';

const ResultsScreen = lazy(() => import('./components/ResultsScreen'));

/**
 * App — root component managing screen state.
 * Owns the useEmergencyAnalysis hook and passes it to both screens.
 * ResultsScreen is lazy-loaded for performance.
 */
function App() {
  const [screen, setScreen] = useState('input');
  const emergency = useEmergencyAnalysis();

  const handleNavigateToResults = useCallback(() => {
    setScreen('results');
  }, []);

  const handleReset = useCallback(() => {
    emergency.reset();
    setScreen('input');
  }, [emergency]);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Skip link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {/* Top loading progress bar */}
      {emergency.status === 'loading' && (
        <div
          className="fixed top-0 left-0 right-0 z-50 h-1 bg-bg-primary overflow-hidden"
          role="progressbar"
          aria-label="Emergency report is being analysed"
          aria-valuetext="Analysing emergency report"
        >
          <div className="h-full animate-shimmer-bar w-full" />
        </div>
      )}

      <div id="main-content" className={`transition-opacity duration-300 ease-out ${screen === 'input' ? 'animate-fade-in' : ''}`}>
        {screen === 'input' ? (
          <InputScreen
            analyse={emergency.analyse}
            status={emergency.status}
            error={emergency.error}
            onNavigate={handleNavigateToResults}
          />
        ) : (
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading results">
                <p className="text-text-muted text-sm">Loading results…</p>
              </div>
            }
          >
            <div className="animate-fade-in-up">
              <ResultsScreen
                result={emergency.result}
                status={emergency.status}
                error={emergency.error}
                onReset={handleReset}
              />
            </div>
          </Suspense>
        )}
      </div>

      {/* Powered by Gemini footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-2 text-center pointer-events-none">
        <p className="text-xs text-text-muted flex items-center justify-center gap-1.5">
          Powered by
          <span className="font-semibold" style={{ color: '#4285F4' }}>
            Google Gemini
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L2 19.5h20L12 2z" fill="#4285F4" opacity="0.8" />
            <path d="M12 8l-5 9h10l-5-9z" fill="#4285F4" />
          </svg>
        </p>
      </footer>
    </div>
  );
}

export default App;
